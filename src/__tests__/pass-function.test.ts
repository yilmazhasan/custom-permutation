import CustomPermutation from '../../src/CustomPermutation';

function collectAll<T>(cp: CustomPermutation<T>): T[][] {
  const perms: any[][] = [];
  let n: any;
  while ((n = cp.next())) perms.push(n);
  return perms;
}

describe('passFn', () => {
  test('only yields permutations that satisfy the predicate', () => {
    const startsWithA = (items: any[]) => items[0] === 'a';
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, {}, undefined, startsWithA);
    const perms = collectAll(cp);
    // Full perms of ['a','b','c'] = 6; those starting with 'a': ['a','b','c'], ['a','c','b']
    expect(perms.length).toBe(2);
    perms.forEach((p) => expect(p[0]).toBe('a'));
  });

  test('predicate returning true for everything yields same count as no filter', () => {
    const alwaysPass = () => true;
    const filtered = collectAll(new CustomPermutation(['a', 'b', 'c'], {}, {}, undefined, alwaysPass));
    const unfiltered = collectAll(new CustomPermutation(['a', 'b', 'c'], {}, {}));
    expect(filtered.length).toBe(unfiltered.length);
  });

  test('passFn interacts correctly with choices constraint', () => {
    // choices: position 1 can only be 'a' or 'b'
    // passFn: first element must not be 'a'
    const notStartsWithA = (items: any[]) => items[0] !== 'a';
    const cp = new CustomPermutation(['a', 'b', 'c'], { 1: ['a', 'b'] }, {}, undefined, notStartsWithA);
    const perms = collectAll(cp);
    perms.forEach((p) => {
      expect(p[0]).not.toBe('a');
      expect(['a', 'b']).toContain(p[1]);
    });
  });

  test('passFn works correctly alongside nonChoices constraint', () => {
    // nonChoices: position 0 cannot be 'a'
    // passFn: last element must be 'c'
    const endsWithC = (items: any[]) => items[items.length - 1] === 'c';
    const cp = new CustomPermutation(['a', 'b', 'c'], {}, { 0: ['a'] }, undefined, endsWithC);
    const perms = collectAll(cp);
    perms.forEach((p) => {
      expect(p[0]).not.toBe('a');
      expect(p[p.length - 1]).toBe('c');
    });
  });
});
