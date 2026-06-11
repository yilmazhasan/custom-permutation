import CustomPermutation from '../../src/CustomPermutation';

function collectAll(cp: CustomPermutation): any[][] {
  const perms: any[][] = [];
  let n: any;
  while ((n = cp.next())) perms.push(n);
  return perms;
}

describe('numeric elements', () => {
  test('generates all 6 permutations of three distinct numbers', () => {
    const perms = collectAll(new CustomPermutation([1, 2, 3], {}, {}));
    expect(perms.length).toBe(6);
  });

  test('choices constraint works with numeric elements', () => {
    // position 0 can only be 1
    const perms = collectAll(new CustomPermutation([1, 2, 3], { 0: [1] }, {}));
    expect(perms.length).toBe(2);
    perms.forEach((p) => expect(p[0]).toBe(1));
  });

  test('nonChoices constraint works with numeric elements', () => {
    // position 0 cannot be 1
    const perms = collectAll(new CustomPermutation([1, 2, 3], {}, { 0: [1] }));
    perms.forEach((p) => expect(p[0]).not.toBe(1));
  });
});

describe('all-same elements', () => {
  test('list of identical elements yields exactly one permutation', () => {
    const perms = collectAll(new CustomPermutation(['a', 'a', 'a'], {}, {}));
    expect(perms.length).toBe(1);
    expect(perms[0]).toEqual(['a', 'a', 'a']);
  });

  test('two pairs of identical elements: 4!/(2!*2!) = 6 distinct permutations', () => {
    const perms = collectAll(new CustomPermutation(['a', 'a', 'b', 'b'], {}, {}));
    expect(perms.length).toBe(6);
  });

  test('all duplicate results contain only the repeated element', () => {
    const perms = collectAll(new CustomPermutation(['z', 'z'], {}, {}));
    expect(perms.length).toBe(1);
    expect(perms[0]).toEqual(['z', 'z']);
  });
});

describe('two-element lists', () => {
  test('two distinct elements produce exactly 2 permutations', () => {
    const perms = collectAll(new CustomPermutation(['x', 'y'], {}, {}));
    expect(perms.length).toBe(2);
    expect(perms).toContainEqual(['x', 'y']);
    expect(perms).toContainEqual(['y', 'x']);
  });
});
