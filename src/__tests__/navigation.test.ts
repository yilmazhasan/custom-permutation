import CustomPermutation from '../../src/CustomPermutation';

function collectAll<T>(cp: CustomPermutation<T>): T[][] {
  const perms: any[][] = [];
  let n: any;
  while ((n = cp.next())) perms.push(n);
  return perms;
}

describe('getSet', () => {
  test('returns the unique elements from the input list', () => {
    const cp = new CustomPermutation(['a', 'b', 'a', 'c'], {}, {});
    expect(cp.customPermGen.getSet()).toEqual(['a', 'b', 'c']);
  });

  test('returns empty array for empty input', () => {
    const cp = new CustomPermutation([], {}, {});
    expect(cp.customPermGen.getSet()).toEqual([]);
  });

  test('returns single-element array for a single-element list', () => {
    const cp = new CustomPermutation(['x'], {}, {});
    expect(cp.customPermGen.getSet()).toEqual(['x']);
  });
});

describe('isEmpty', () => {
  test('returns true for an empty input list', () => {
    const cp = new CustomPermutation([], {}, {});
    expect(cp.customPermGen.isEmpty()).toBe(true);
  });

  test('returns false for a non-empty input list', () => {
    const cp = new CustomPermutation(['a', 'b'], {}, {});
    expect(cp.customPermGen.isEmpty()).toBe(false);
  });
});

describe('reset', () => {
  test('rewinds the cursor so next() replays from the first permutation', () => {
    const cp = new CustomPermutation(['a', 'b'], {}, {});
    const first = cp.next();
    cp.next();
    cp.customPermGen.reset();
    expect(cp.next()).toEqual(first);
  });

  test('after reset, all permutations can be replayed in order', () => {
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {});
    const firstPass = collectAll(cp);
    cp.customPermGen.reset();
    const secondPass = collectAll(cp);
    expect(secondPass).toEqual(firstPass);
  });
});

describe('prev', () => {
  test('returns the permutation before the most recently retrieved one', () => {
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {});
    const first = cp.next();
    cp.next();
    const back = cp.customPermGen.prev();
    expect(back).toEqual(first);
  });

  test('after prev(), next() re-returns the permutation that was current before going back', () => {
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {});
    cp.next();
    const second = cp.next();
    cp.customPermGen.prev();
    expect(cp.next()).toEqual(second);
  });

  test('returns undefined when fewer than two permutations have been retrieved', () => {
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {});
    cp.next();
    expect(cp.customPermGen.prev()).toBeUndefined();
  });

  test('returns undefined before any permutation is retrieved', () => {
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {});
    expect(cp.customPermGen.prev()).toBeUndefined();
  });
});

describe('last', () => {
  test('returns the last permutation in history after full iteration', () => {
    const cp = new CustomPermutation(['a', 'b'], {}, {});
    const all = collectAll(cp);
    cp.customPermGen.reset();
    expect(cp.customPermGen.last()).toEqual(all[all.length - 1]);
  });

  test('after last(), reset + next() starts from the first permutation', () => {
    const cp = new CustomPermutation(['a', 'b'], {}, {});
    const all = collectAll(cp);
    cp.customPermGen.reset();
    cp.customPermGen.last();
    cp.customPermGen.reset();
    expect(cp.next()).toEqual(all[0]);
  });
});

describe('getCurrent', () => {
  test('returns null before any permutation is retrieved', () => {
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {});
    expect(cp.customPermGen.getCurrent()).toBeNull();
  });

  test('returns null while cursor is at the tip of history (after next())', () => {
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {});
    cp.next();
    // cursor === history.length — getCurrent returns null at the tip
    expect(cp.customPermGen.getCurrent()).toBeNull();
  });

  test('returns the item at the current cursor position after going back with prev()', () => {
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {});
    cp.next();
    const second = cp.next();
    cp.customPermGen.prev(); // cursor moves back one
    // getCurrent now points at position inside history
    expect(cp.customPermGen.getCurrent()).toEqual(second);
  });
});
