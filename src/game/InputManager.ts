import * as THREE from 'three';
import { PieceManager } from './PieceManager';
import { BoardManager } from './BoardManager';
import { ChessGame } from './ChessGame';

export class InputManager {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private camera: THREE.Camera;
  private domElement: HTMLElement;
  private pieceManager: PieceManager;
  private boardManager: BoardManager;
  private game: ChessGame;
  private enabled: boolean = true;
  private boundOnClick: (event: MouseEvent) => void;

  constructor(
    camera: THREE.Camera,
    domElement: HTMLElement,
    pieceManager: PieceManager,
    boardManager: BoardManager,
    game: ChessGame
  ) {
    this.camera = camera;
    this.domElement = domElement;
    this.pieceManager = pieceManager;
    this.boardManager = boardManager;
    this.game = game;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.boundOnClick = this.onClick.bind(this);
    this.domElement.addEventListener('click', this.boundOnClick);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private onClick(event: MouseEvent): void {
    if (!this.enabled) return;
    if (!this.game.gameStarted) return;
    if (!this.game.isLocalPlayerTurn()) return;

    // Calculate normalized device coordinates
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // First: check if a piece was clicked
    const pieceGroups = this.pieceManager.getAllPieceMeshes();
    const allPieceMeshes: THREE.Object3D[] = [];
    for (const group of pieceGroups) {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          allPieceMeshes.push(child);
        }
      });
    }

    const pieceIntersects = this.raycaster.intersectObjects(allPieceMeshes, false);

    if (pieceIntersects.length > 0) {
      const hit = pieceIntersects[0].object;
      const square = hit.userData.square as string;
      const pieceColor = hit.userData.pieceColor as string;

      // If clicking own piece, select it
      if (pieceColor === this.game.playerColor) {
        this.game.selectPiece(square);
        return;
      }

      // If clicking opponent's piece while a piece is selected, treat as capture attempt
      if (this.game.selectedSquare) {
        this.game.makeMove(this.game.selectedSquare, square);
        return;
      }

      return;
    }

    // Second: check if a board square was clicked
    const boardSquares = Array.from(this.boardManager.squareMeshes.values());
    const squareIntersects = this.raycaster.intersectObjects(boardSquares, false);

    if (squareIntersects.length > 0 && this.game.selectedSquare) {
      const hit = squareIntersects[0].object;
      const targetSquare = hit.userData.square as string;
      this.game.makeMove(this.game.selectedSquare, targetSquare);
      return;
    }

    // Also check valid move indicators (the green circles)
    // If nothing matched, deselect
    this.game.selectPiece(null as any);
  }

  dispose(): void {
    this.domElement.removeEventListener('click', this.boundOnClick);
  }
}
