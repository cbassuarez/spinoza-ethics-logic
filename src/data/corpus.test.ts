import { describe, expect, it } from 'vitest';
import { corpus, getItemById } from '.';

describe('corpus', () => {
  it('is non-empty', () => {
    expect(corpus.length).toBeGreaterThan(0);
  });

  it('contains known sample item', () => {
    const item = getItemById('E1D1');
    expect(item).toBeDefined();
    expect(item?.text.translation).toContain('cause of itself');
  });
});
