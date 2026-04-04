export interface MoveRecord {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  color: 'w' | 'b';
  san?: string;
  promotion?: string;
}

export class MoveHistory {
  private container: HTMLElement | null;
  private moves: MoveRecord[] = [];
  private moveNumber: number = 1;

  constructor() {
    this.container = document.getElementById('move-history');
  }

  addMove(move: MoveRecord): void {
    this.moves.push(move);

    const notation = move.san || this.formatMove(move);
    const isWhite = move.color === 'w';

    if (isWhite) {
      // Start a new move row for white's move
      const row = document.createElement('div');
      row.classList.add('move-row');

      const numberSpan = document.createElement('span');
      numberSpan.classList.add('move-number');
      numberSpan.textContent = `${this.moveNumber}.`;

      const whiteSpan = document.createElement('span');
      whiteSpan.classList.add('move-white');
      whiteSpan.textContent = notation;

      const blackSpan = document.createElement('span');
      blackSpan.classList.add('move-black');
      blackSpan.textContent = '';

      row.appendChild(numberSpan);
      row.appendChild(whiteSpan);
      row.appendChild(blackSpan);

      this.container?.appendChild(row);
    } else {
      // Fill in the black move on the current row
      const rows = this.container?.querySelectorAll('.move-row');
      if (rows && rows.length > 0) {
        const lastRow = rows[rows.length - 1];
        const blackSpan = lastRow.querySelector('.move-black');
        if (blackSpan) {
          blackSpan.textContent = notation;
        }
      }
      this.moveNumber++;
    }

    this.scrollToBottom();
  }

  clear(): void {
    this.moves = [];
    this.moveNumber = 1;
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  private formatMove(move: MoveRecord): string {
    const pieceLetters: Record<string, string> = {
      k: 'K',
      q: 'Q',
      r: 'R',
      b: 'B',
      n: 'N',
      p: '',
    };

    const pieceType = move.piece.length === 2 ? move.piece[1] : move.piece;
    const prefix = pieceLetters[pieceType] ?? '';
    const capture = move.captured ? 'x' : '';

    // For pawns, show the file of origin on captures
    let fromFile = '';
    if (!prefix && move.captured && move.from) {
      fromFile = move.from[0];
    }

    const promotionSuffix = move.promotion ? `=${move.promotion.toUpperCase()}` : '';

    return `${fromFile}${prefix}${capture}${move.to}${promotionSuffix}`;
  }

  private scrollToBottom(): void {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }
}
