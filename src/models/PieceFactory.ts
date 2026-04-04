import * as THREE from 'three';
import { PieceType } from '../utils/constants';
import { createPawnGeometry } from './PawnGeometry';
import { createRookGeometry } from './RookGeometry';
import { createKnightGeometry } from './KnightGeometry';
import { createBishopGeometry } from './BishopGeometry';
import { createQueenGeometry } from './QueenGeometry';
import { createKingGeometry } from './KingGeometry';

export function createPieceModel(type: PieceType, material: THREE.Material): THREE.Group {
  switch (type) {
    case 'p':
      return createPawnGeometry(material);
    case 'r':
      return createRookGeometry(material);
    case 'n':
      return createKnightGeometry(material);
    case 'b':
      return createBishopGeometry(material);
    case 'q':
      return createQueenGeometry(material);
    case 'k':
      return createKingGeometry(material);
    default: {
      const _exhaustive: never = type;
      throw new Error(`Unknown piece type: ${_exhaustive}`);
    }
  }
}
