export interface CastlingSquares {
  kingFrom: string;
  kingTo: string;
  rookFrom: string;
  rookTo: string;
}

export interface CastlingTiming {
  kingDelay: number;
  rookDelay: number;
  duration: number;
}

export interface CastlingConfig {
  timing: CastlingTiming;
}

export const CASTLING_CONFIG: CastlingConfig = {
  timing: {
    kingDelay: 0,
    rookDelay: 150,
    duration: 500,
  },
};

const CASTLING_MAP: Record<string, CastlingSquares> = {
  'e1-g1': { kingFrom: 'e1', kingTo: 'g1', rookFrom: 'h1', rookTo: 'f1' },
  'e1-c1': { kingFrom: 'e1', kingTo: 'c1', rookFrom: 'a1', rookTo: 'd1' },
  'e8-g8': { kingFrom: 'e8', kingTo: 'g8', rookFrom: 'h8', rookTo: 'f8' },
  'e8-c8': { kingFrom: 'e8', kingTo: 'c8', rookFrom: 'a8', rookTo: 'd8' },
};

export function getCastlingSquares(from: string, to: string): CastlingSquares | null {
  return CASTLING_MAP[`${from}-${to}`] ?? null;
}

export function isCastlingMove(from: string, to: string): boolean {
  return `${from}-${to}` in CASTLING_MAP;
}
