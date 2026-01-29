import { z } from 'zod';

/**
 * Accepts:
 *  - "123" → 123
 *  - 123   → 123
 *  - ""    → null
 *  - null  → null
 *  - undefined → undefined (key omitted)
 * Rejects:
 *  - "abc"
 */
export const numberOrNull = () =>
  z.preprocess((val) => {
    console.log('Preprocessing value:', val);
    if (val === '' || val === null) return null;
    if (val === undefined) return undefined;
    if (typeof val === 'string') {
      const num = Number(val);
      return Number.isNaN(num) ? val : num;
    }
    return val;
  }, z.number().nullable().optional());
