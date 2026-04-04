import { PIECE_SYMBOLS, PieceColor } from '../utils/constants';

export class CapturedPieces {
  private opponentContainer: HTMLElement | null;
  private playerContainer: HTMLElement | null;
  private playerColor: PieceColor = 'w';

  constructor() {
    this.opponentContainer = document.getElementById('opponent-captured');
    this.playerContainer = document.getElementById('player-captured');
  }

  setPlayerColor(color: PieceColor): void {
    this.playerColor = color;
  }

  /**
   * Add a captured piece to the appropriate panel.
   * @param pieceType - The type of the captured piece (e.g., 'p', 'q', 'r', 'b', 'n', 'k')
   * @param pieceColor - The color of the captured piece ('w' or 'b')
   */
  addCaptured(pieceType: string, pieceColor: PieceColor): void {
    const symbolKey = `${pieceColor}${pieceType}`;
    const symbol = PIECE_SYMBOLS[symbolKey] || pieceType;

    const span = document.createElement('span');
    span.classList.add('captured-piece');
    span.textContent = symbol;
    span.title = symbolKey;

    // Pieces captured by the player go to opponent-captured (shown on opponent's side),
    // pieces captured by the opponent go to player-captured (shown on player's side).
    // A captured piece's color tells us who lost it:
    // - If the captured piece is the same color as the player, it goes to player-captured
    // - If the captured piece is the opponent's color, it goes to opponent-captured
    const container = pieceColor === this.playerColor
      ? this.playerContainer
      : this.opponentContainer;

    container?.appendChild(span);
  }

  clear(): void {
    if (this.opponentContainer) {
      this.opponentContainer.innerHTML = '';
    }
    if (this.playerContainer) {
      this.playerContainer.innerHTML = '';
    }
  }
}
