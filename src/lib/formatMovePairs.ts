export interface MovePair {
  number: number;
  white: string;
  black?: string;
}

export function formatMovePairs(moves: string[]): MovePair[] {
  const pairs: MovePair[] = [];

  for (let i = 0; i < moves.length; i += 2) {
    const pair: MovePair = {
      number: Math.floor(i / 2) + 1,
      white: moves[i],
    };
    if (i + 1 < moves.length) {
      pair.black = moves[i + 1];
    }
    pairs.push(pair);
  }

  return pairs;
}
