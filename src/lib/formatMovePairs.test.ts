import { describe, it, expect } from 'vitest';
import { formatMovePairs } from './formatMovePairs';

describe('formatMovePairs', () => {
  it('returns empty array for no moves', () => {
    expect(formatMovePairs([])).toEqual([]);
  });

  it('returns 1 row with white only for 1 move', () => {
    const result = formatMovePairs(['e4']);
    expect(result).toEqual([{ number: 1, white: 'e4' }]);
  });

  it('returns 1 complete row for 2 moves', () => {
    const result = formatMovePairs(['e4', 'e5']);
    expect(result).toEqual([{ number: 1, white: 'e4', black: 'e5' }]);
  });

  it('returns 2 rows for 3 moves', () => {
    const result = formatMovePairs(['e4', 'e5', 'Nf3']);
    expect(result).toEqual([
      { number: 1, white: 'e4', black: 'e5' },
      { number: 2, white: 'Nf3' },
    ]);
  });

  it('handles 4 moves correctly', () => {
    const result = formatMovePairs(['e4', 'e5', 'Nf3', 'Nc6']);
    expect(result).toEqual([
      { number: 1, white: 'e4', black: 'e5' },
      { number: 2, white: 'Nf3', black: 'Nc6' },
    ]);
  });
});
