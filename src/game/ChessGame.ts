import { Chess, Square } from 'chess.js';
import { PieceColor, PieceType } from '../utils/constants';
import { algebraicToWorld } from '../utils/helpers';
import { PieceManager } from './PieceManager';
import { HighlightManager } from './HighlightManager';
import { AnimationManager } from './AnimationManager';
import { NetworkManager, GameMessage } from '../network/NetworkManager';
import { CameraController } from '../scene/CameraController';

export class ChessGame {
  chess: Chess;
  selectedSquare: string | null = null;
  playerColor: PieceColor = 'w';
  gameStarted: boolean = false;

  // Event callbacks
  onMove: ((move: any) => void) | null = null;
  onGameOver: ((result: string) => void) | null = null;
  onStatusChange: ((status: string) => void) | null = null;
  onTurnChange: ((turn: PieceColor) => void) | null = null;
  onPromotionNeeded: (() => void) | null = null;

  // Promotion dialog support
  pendingPromotion: { from: string; to: string } | null = null;
  private promotionResolve: ((piece: string) => void) | null = null;

  private pieceManager: PieceManager;
  private highlightManager: HighlightManager;
  private animationManager: AnimationManager;
  private networkManager: NetworkManager | null;
  private cameraController: CameraController;
  private isAnimating: boolean = false;

  constructor(
    pieceManager: PieceManager,
    highlightManager: HighlightManager,
    animationManager: AnimationManager,
    networkManager: NetworkManager | null,
    cameraController: CameraController
  ) {
    this.chess = new Chess();
    this.pieceManager = pieceManager;
    this.highlightManager = highlightManager;
    this.animationManager = animationManager;
    this.networkManager = networkManager;
    this.cameraController = cameraController;

    if (this.networkManager) {
      this.networkManager.onMessage((msg: GameMessage) => {
        this.handleNetworkMessage(msg);
      });
    }
  }

  startGame(playerColor: PieceColor): void {
    this.chess.reset();
    this.playerColor = playerColor;
    this.gameStarted = true;
    this.selectedSquare = null;
    this.isAnimating = false;

    this.highlightManager.clearAll();
    this.pieceManager.setupInitialPosition();
    this.cameraController.setPlayerPerspective(playerColor);

    this.onStatusChange?.('');
    this.onTurnChange?.(this.chess.turn() as PieceColor);
  }

  selectPiece(square: string): void {
    if (this.isAnimating) return;

    // Deselect if clicking same square or null
    if (!square || square === this.selectedSquare) {
      this.selectedSquare = null;
      this.highlightManager.clearValidMoves();
      this.highlightManager.clearAll();
      this.restoreLastMoveHighlight();
      return;
    }

    // Only allow selecting own pieces
    const piece = this.chess.get(square as Square);
    if (!piece || piece.color !== this.playerColor) {
      return;
    }

    this.selectedSquare = square;
    this.highlightManager.clearAll();
    this.restoreLastMoveHighlight();
    this.highlightManager.showSelected(square);

    const validMoves = this.getValidMoves(square);
    this.highlightManager.showValidMoves(validMoves);
  }

  async makeMove(from: string, to: string, promotion?: string): Promise<boolean> {
    if (this.isAnimating) return false;
    if (!this.isLocalPlayerTurn()) return false;

    // Check if promotion is needed but not provided - ask the user
    if (this.needsPromotion(from, to) && !promotion) {
      this.pendingPromotion = { from, to };
      this.onPromotionNeeded?.();

      // Wait for the user to choose a promotion piece
      promotion = await new Promise<string>((resolve) => {
        this.promotionResolve = resolve;
      });
      this.pendingPromotion = null;
    }

    // Validate with chess.js
    let move;
    try {
      move = this.chess.move({ from, to, promotion });
    } catch {
      // Invalid move
      this.selectedSquare = null;
      this.highlightManager.clearAll();
      return false;
    }

    if (!move) {
      this.selectedSquare = null;
      this.highlightManager.clearAll();
      return false;
    }

    // Clear highlights before animation
    this.selectedSquare = null;
    this.highlightManager.clearAll();

    // Animate the move
    await this.animateChessMove(move);

    // Show last move highlight
    this.highlightManager.showLastMove(from, to);

    // Check for check
    this.updateCheckHighlight();

    // Send move over network
    if (this.networkManager) {
      this.networkManager.send({
        type: 'move',
        data: { from, to, promotion },
      });
    }

    // Notify callbacks
    this.onMove?.(move);
    this.onTurnChange?.(this.chess.turn() as PieceColor);

    // Check game over
    this.checkGameOver();

    return true;
  }

  async applyRemoteMove(from: string, to: string, promotion?: string): Promise<void> {
    // Apply move from opponent
    let move;
    try {
      move = this.chess.move({ from, to, promotion });
    } catch {
      console.error('[ChessGame] Invalid remote move:', from, to);
      return;
    }

    if (!move) {
      console.error('[ChessGame] Failed to apply remote move:', from, to);
      return;
    }

    // Clear any highlights
    this.highlightManager.clearAll();

    // Animate the move
    await this.animateChessMove(move);

    // Show last move highlight
    this.highlightManager.showLastMove(from, to);

    // Check for check
    this.updateCheckHighlight();

    // Notify callbacks
    this.onMove?.(move);
    this.onTurnChange?.(this.chess.turn() as PieceColor);

    // Check game over
    this.checkGameOver();
  }

  isLocalPlayerTurn(): boolean {
    return this.gameStarted && (this.chess.turn() as PieceColor) === this.playerColor;
  }

  getValidMoves(square: string): string[] {
    const moves = this.chess.moves({ square: square as Square, verbose: true });
    return moves.map((m: any) => m.to);
  }

  needsPromotion(from: string, to: string): boolean {
    const piece = this.chess.get(from as Square);
    if (!piece || piece.type !== 'p') return false;

    const toRank = to[1];
    if (piece.color === 'w' && toRank === '8') return true;
    if (piece.color === 'b' && toRank === '1') return true;

    return false;
  }

  reset(): void {
    this.chess.reset();
    this.selectedSquare = null;
    this.gameStarted = false;
    this.isAnimating = false;
    this.pendingPromotion = null;
    this.promotionResolve = null;
    this.highlightManager.clearAll();
    this.pieceManager.setupInitialPosition();
    this.onStatusChange?.('Game reset');
  }

  resolvePromotion(piece: string): void {
    if (this.promotionResolve) {
      this.promotionResolve(piece);
      this.promotionResolve = null;
    }
  }

  private async animateChessMove(move: any): Promise<void> {
    this.isAnimating = true;

    try {
      // Handle castling
      if (move.flags.includes('k') || move.flags.includes('q')) {
        await this.animateCastling(move);
        return;
      }

      // Handle en passant capture
      if (move.flags.includes('e')) {
        // Remove the captured pawn (it's not on the 'to' square)
        const capturedSquare = move.to[0] + move.from[1];
        const capturedGroup = this.pieceManager.removePiece(capturedSquare);
        if (capturedGroup) {
          this.animationManager.animateCapture(capturedGroup);
        }
      }

      // Handle regular capture
      if (move.captured && !move.flags.includes('e')) {
        const capturedGroup = this.pieceManager.removePiece(move.to);
        if (capturedGroup) {
          await this.animationManager.animateCapture(capturedGroup);
        }
      }

      // Animate the moving piece
      const piece = this.pieceManager.getPieceAt(move.from);
      if (piece) {
        const targetPos = algebraicToWorld(move.to);
        await this.animationManager.animateMove(piece.group, targetPos.x, targetPos.z);
        this.pieceManager.movePiece(move.from, move.to);

        // Handle promotion - replace pawn with promoted piece
        if (move.promotion) {
          const color = piece.color;
          this.pieceManager.removePiece(move.to);
          this.pieceManager.addPiece(move.promotion as PieceType, color, move.to);
        }
      }
    } finally {
      this.isAnimating = false;
    }
  }

  private async animateCastling(move: any): Promise<void> {
    const isKingside = move.flags.includes('k');
    const rank = move.color === 'w' ? '1' : '8';

    const kingFrom = move.from;
    const kingTo = move.to;
    const rookFrom = isKingside ? `h${rank}` : `a${rank}`;
    const rookTo = isKingside ? `f${rank}` : `d${rank}`;

    // Animate king and rook simultaneously
    const kingPiece = this.pieceManager.getPieceAt(kingFrom);
    const rookPiece = this.pieceManager.getPieceAt(rookFrom);

    const promises: Promise<void>[] = [];

    if (kingPiece) {
      const kingTarget = algebraicToWorld(kingTo);
      promises.push(
        this.animationManager.animateMove(kingPiece.group, kingTarget.x, kingTarget.z)
      );
    }

    if (rookPiece) {
      const rookTarget = algebraicToWorld(rookTo);
      promises.push(
        this.animationManager.animateMove(rookPiece.group, rookTarget.x, rookTarget.z)
      );
    }

    await Promise.all(promises);

    // Update piece positions in the map
    this.pieceManager.movePiece(kingFrom, kingTo);
    this.pieceManager.movePiece(rookFrom, rookTo);
  }

  private updateCheckHighlight(): void {
    if (this.chess.isCheck()) {
      // Find the king in check
      const turn = this.chess.turn();
      const board = this.chess.board();
      for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
          const piece = board[rank][file];
          if (piece && piece.type === 'k' && piece.color === turn) {
            const square = String.fromCharCode('a'.charCodeAt(0) + file) + (8 - rank);
            this.highlightManager.showCheck(square);
            return;
          }
        }
      }
    }
  }

  private checkGameOver(): void {
    if (!this.chess.isGameOver()) return;

    let result: string;

    if (this.chess.isCheckmate()) {
      const winner = this.chess.turn() === 'w' ? 'Pretas' : 'Brancas';
      result = `Xeque-mate! ${winner} vencem!`;
    } else if (this.chess.isStalemate()) {
      result = 'Empate por afogamento!';
    } else if (this.chess.isDraw()) {
      result = 'Empate!';
    } else {
      result = 'Fim de jogo!';
    }

    this.onGameOver?.(result);
    this.onStatusChange?.(result);
  }

  private restoreLastMoveHighlight(): void {
    const history = this.chess.history({ verbose: true });
    if (history.length > 0) {
      const lastMove = history[history.length - 1];
      this.highlightManager.showLastMove(lastMove.from, lastMove.to);
    }
  }

  private handleNetworkMessage(msg: GameMessage): void {
    switch (msg.type) {
      case 'move':
        if (msg.data) {
          this.applyRemoteMove(msg.data.from, msg.data.to, msg.data.promotion);
        }
        break;
      case 'resign': {
        const winner = this.playerColor === 'w' ? 'Brancas' : 'Pretas';
        const resignMsg = `${winner} vencem por desistência do oponente!`;
        this.onGameOver?.(resignMsg);
        this.onStatusChange?.(resignMsg);
        break;
      }
      case 'ready':
        this.startGame(this.playerColor);
        break;
    }
  }
}
