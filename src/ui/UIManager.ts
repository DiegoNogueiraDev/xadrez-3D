import { ChessGame } from '../game/ChessGame';
import { NetworkManager } from '../network/NetworkManager';
import { MoveHistory } from './MoveHistory';
import { CapturedPieces } from './CapturedPieces';
import { GameStatus } from './GameStatus';
import { Lobby } from './Lobby';

export class UIManager {
  private lobby: Lobby;
  private moveHistory: MoveHistory;
  private capturedPieces: CapturedPieces;
  private gameStatus: GameStatus;

  constructor(game: ChessGame, networkManager: NetworkManager) {
    this.lobby = new Lobby(game, networkManager);
    this.moveHistory = new MoveHistory();
    this.capturedPieces = new CapturedPieces();
    this.gameStatus = new GameStatus();

    // Sync captured pieces panel orientation with player color
    if (game.playerColor) {
      this.capturedPieces.setPlayerColor(game.playerColor);
    }

    // Wire up game events to UI updates
    game.onMove = (move) => {
      this.moveHistory.addMove(move);
      if (move.captured) {
        // The captured piece's color is the opposite of the moving piece's color
        const capturedColor = move.color === 'w' ? 'b' : 'w';
        this.capturedPieces.addCaptured(move.captured, capturedColor);
      }
    };

    game.onTurnChange = (turn) => {
      this.gameStatus.updateTurn(turn, game.playerColor);
    };

    game.onStatusChange = (status) => {
      this.gameStatus.updateStatus(status);
    };

    game.onGameOver = (result) => {
      this.showGameOver(result);
    };

    // New game button
    document.getElementById('btn-new-game')?.addEventListener('click', () => {
      game.reset();
      this.moveHistory.clear();
      this.capturedPieces.clear();
      this.gameStatus.updateStatus('');
    });

    // Resign button
    document.getElementById('btn-resign')?.addEventListener('click', () => {
      networkManager.send({ type: 'resign' });
      const winner = game.playerColor === 'w' ? 'Pretas' : 'Brancas';
      game.onGameOver?.(`${winner} vencem por desistência!`);
    });

    // Promotion dialog buttons
    document.querySelectorAll('.promo-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const piece = (btn as HTMLElement).dataset.piece;
        if (piece && game.pendingPromotion) {
          game.resolvePromotion(piece);
          this.hidePromotionDialog();
        }
      });
    });

    // Network connection state changes
    networkManager.onConnectionChange = (connected) => {
      this.gameStatus.updateConnection(connected);
    };
  }

  showGameScreen(): void {
    document.getElementById('lobby-screen')?.classList.add('hidden');
    document.getElementById('game-ui')?.classList.remove('hidden');
  }

  showPromotionDialog(): void {
    const dialog = document.getElementById('promotion-dialog');
    if (dialog) {
      dialog.classList.remove('hidden');
    }
  }

  hidePromotionDialog(): void {
    const dialog = document.getElementById('promotion-dialog');
    if (dialog) {
      dialog.classList.add('hidden');
    }
  }

  showGameOver(message: string): void {
    // Remove any existing overlay
    const existing = document.getElementById('game-over-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.innerHTML = `
      <div class="game-over-box">
        <h2>Fim de Jogo</h2>
        <p>${message}</p>
        <button class="btn btn-primary" id="btn-play-again">Jogar Novamente</button>
      </div>
    `;

    // Append to ui-overlay if it exists, otherwise to body
    const parent = document.getElementById('ui-overlay') || document.body;
    parent.appendChild(overlay);

    document.getElementById('btn-play-again')?.addEventListener('click', () => {
      overlay.remove();
      // Return to lobby
      document.getElementById('lobby-screen')?.classList.remove('hidden');
      document.getElementById('game-ui')?.classList.add('hidden');
    });
  }
}
