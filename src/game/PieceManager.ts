import * as THREE from 'three';
import { Chess } from 'chess.js';
import { COLORS, PieceColor, PieceType } from '../utils/constants';
import { algebraicToWorld, fileRankToAlgebraic } from '../utils/helpers';
import { createPieceModel } from '../models/PieceFactory';

export interface PieceMesh {
  group: THREE.Group;
  type: PieceType;
  color: PieceColor;
  square: string;
}

export class PieceManager {
  pieces: Map<string, PieceMesh> = new Map();
  private scene: THREE.Scene;
  private whiteMaterial: THREE.MeshStandardMaterial;
  private blackMaterial: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.whiteMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.whitePiece,
      roughness: 0.4,
      metalness: 0.1,
    });

    this.blackMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.blackPiece,
      roughness: 0.4,
      metalness: 0.2,
    });
  }

  setupInitialPosition(): void {
    this.clearAll();

    const chess = new Chess();
    const board = chess.board();

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[7 - rank][file];
        if (piece) {
          const square = fileRankToAlgebraic(file, rank);
          this.addPiece(piece.type as PieceType, piece.color as PieceColor, square);
        }
      }
    }
  }

  getPieceAt(square: string): PieceMesh | undefined {
    return this.pieces.get(square);
  }

  movePiece(from: string, to: string): void {
    const piece = this.pieces.get(from);
    if (!piece) return;

    this.pieces.delete(from);
    piece.square = to;
    this.pieces.set(to, piece);

    const pos = algebraicToWorld(to);
    piece.group.position.x = pos.x;
    piece.group.position.z = pos.z;
  }

  removePiece(square: string): THREE.Group | undefined {
    const piece = this.pieces.get(square);
    if (!piece) return undefined;

    this.scene.remove(piece.group);
    this.pieces.delete(square);
    return piece.group;
  }

  addPiece(type: PieceType, color: PieceColor, square: string): void {
    const material = color === 'w' ? this.whiteMaterial : this.blackMaterial;
    const group = createPieceModel(type, material);

    const pos = algebraicToWorld(square);
    group.position.x = pos.x;
    group.position.z = pos.z;

    group.userData = { type: 'piece', pieceType: type, pieceColor: color, square };
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData = { type: 'piece', pieceType: type, pieceColor: color, square };
      }
    });

    this.scene.add(group);
    this.pieces.set(square, { group, type, color, square });
  }

  clearAll(): void {
    for (const [, piece] of this.pieces) {
      this.scene.remove(piece.group);
    }
    this.pieces.clear();
  }

  getAllPieceMeshes(): THREE.Group[] {
    const groups: THREE.Group[] = [];
    for (const [, piece] of this.pieces) {
      groups.push(piece.group);
    }
    return groups;
  }
}
