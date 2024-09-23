import CustomPermutation from '../../lib/CustomPermutation';

test('Empty list with next', () => {
  let customPerm = new CustomPermutation([], {}, {});
  let count = 0;
  while (true) {
    let next = customPerm.next();
    if (!next) {
      break;
    }
    count++;
  }
  expect(count).toBe(0);
});

test('Empty list with generator', () => {
  let customPerm = new CustomPermutation([], {}, {});
  let count = 0;
  let gen: any = null;
  gen = customPerm.generator();
  while (true) {
    let next = gen.next();
    if (next.done) {
      break;
    }
    count++;
  }

  expect(count).toBe(0);
});

test('One element list with next', () => {
  let customPerm = new CustomPermutation(['a'], {}, {});
  let count = 0;
  while (true) {
    let next = customPerm.next();
    if (!next) {
      break;
    }
    count++;
  }
  expect(count).toBe(1);
});

test('One element list with generator', () => {
  let customPerm = new CustomPermutation(['a'], {}, {});
  let count = 0;
  let gen: any = null;
  gen = customPerm.generator();
  while (true) {
    let next = gen.next();
    if (next.done) {
      break;
    }
    count++;
  }

  expect(count).toBe(1);
});
