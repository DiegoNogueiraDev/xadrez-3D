import { PieceColor } from '../utils/constants';

export class GameStatus {
  private turnIndicator: HTMLElement | null;
  private statusText: HTMLElement | null;
  private connectionIndicator: HTMLElement | null;

  constructor() {
    this.turnIndicator = document.getElementById('turn-indicator');
    this.statusText = document.getElementById('game-status-text');
    this.connectionIndicator = document.getElementById('connection-indicator');
  }

  updateTurn(turn: PieceColor, playerColor: PieceColor | null): void {
    if (!this.turnIndicator) return;

    const isWhiteTurn = turn === 'w';
    const turnLabel = isWhiteTurn ? 'Brancas' : 'Pretas';
    const isPlayerTurn = turn === playerColor;

    this.turnIndicator.textContent = isPlayerTurn
      ? `Sua vez (${turnLabel})`
      : `Vez do oponente (${turnLabel})`;

    this.turnIndicator.classList.remove('turn-white', 'turn-black');
    this.turnIndicator.classList.add(isWhiteTurn ? 'turn-white' : 'turn-black');
  }

  updateStatus(status: string): void {
    if (!this.statusText) return;
    this.statusText.textContent = status;

    if (status) {
      this.statusText.classList.remove('hidden');
    } else {
      this.statusText.classList.add('hidden');
    }
  }

  updateConnection(connected: boolean): void {
    if (!this.connectionIndicator) return;

    this.connectionIndicator.classList.remove('connected', 'disconnected');
    this.connectionIndicator.classList.add(connected ? 'connected' : 'disconnected');

    const dot = this.connectionIndicator.querySelector('.dot') || this.connectionIndicator;
    if (connected) {
      this.connectionIndicator.title = 'Conectado';
      dot.textContent = dot === this.connectionIndicator ? '● Conectado' : '';
    } else {
      this.connectionIndicator.title = 'Desconectado';
      dot.textContent = dot === this.connectionIndicator ? '● Desconectado' : '';
    }
  }
}
