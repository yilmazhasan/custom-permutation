import CustomPermutation from '../../lib/CustomPermutation';

test('Custom Permutation', () => {
  let customPerm = new CustomPermutation(['a', 'b', 'c'], {}, {});
  let perms: any[] = [];
  let next: String | Number;

  while (true) {
    next = customPerm.customPermGen.next();
    if (next) {
      perms.push(next);
    } else {
      break;
    }
  }

  expect(perms.length).toBe(6);
});

test('Custom Permutation with same element', () => {
  let customPerm = new CustomPermutation(['a', 'b', 'c', 'c'], {}, {});
  let perms: any[] = [];
  let next: String | Number;

  while (true) {
    next = customPerm.customPermGen.next();
    if (next) {
      perms.push(next);
    } else {
      break;
    }
  }
  expect(perms.length).toBe(12);
});

test('Custom Permutation with choices', () => {
  let customPerm = new CustomPermutation(['a', 'b', 'c'], { 0: ['a'] }, {});
  let perms: any[] = [];
  let next: String | Number;

  while (true) {
    next = customPerm.customPermGen.next();
    if (next) {
      perms.push(next);
    } else {
      break;
    }
  }

  expect(perms.length).toBe(2);
});

test('Custom Permutation with non choices', () => {
  let customPerm = new CustomPermutation(['a', 'b', 'c'], {}, { 0: ['a'], 1: ['b'] });
  let perms: any[] = [];
  let next: String | Number;

  while (true) {
    next = customPerm.customPermGen.next();
    if (next) {
      perms.push(next);
    } else {
      break;
    }
  }

  expect(perms.length).toBe(3);
});

test('Full Example', () => {
  let customPerm = new CustomPermutation(['a', 'b', 'c'], { 1: ['a', 'b'] }, { 0: ['a'] });

  let perms: any[] = [];
  let next: String | Number;

  while (true) {
    next = customPerm.customPermGen.next();
    if (next) {
      perms.push(next);
    } else {
      break;
    }
  }

  expect(perms.length).toBe(3);
});

test('Full Comparison Example I', () => {
  let customPerm = new CustomPermutation(['a', 'b', 'c'], { 1: ['a', 'b'] }, { 0: ['a'] });

  let expectedRes = [
    ['b', 'a', 'c'],
    ['c', 'a', 'b'],
    ['c', 'b', 'a'],
  ];

  let perms: any[] = [];
  let next: String | Number;

  while (true) {
    next = customPerm.customPermGen.next();
    if (next) {
      perms.push(next);
    } else {
      break;
    }
  }

  expect(JSON.stringify(perms)).toBe(JSON.stringify(expectedRes));
});

test('Full Comparison Example II', () => {
  let customPerm = new CustomPermutation(['a', 'a', 'b', 'c'], { 1: ['a', 'b'] }, { 0: ['a'] });

  let expectedRes = [
    ['b', 'a', 'a', 'c'],
    ['b', 'a', 'c', 'a'],
    ['c', 'a', 'a', 'b'],
    ['c', 'a', 'b', 'a'],
    ['c', 'b', 'a', 'a'],
  ];

  let perms: any[] = [];
  let next: String | Number;

  while (true) {
    next = customPerm.customPermGen.next();
    if (next) {
      perms.push(next);
    } else {
      break;
    }
  }

  console.log(perms);

  expect(JSON.stringify(perms)).toBe(JSON.stringify(expectedRes));
});
