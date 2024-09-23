import CustomPermutation from '../../lib/CustomPermutation';

test('next', () => {
  let customPerm = new CustomPermutation(['a', 'b', 'c'], {}, {});
  let count = 0;
  while (true) {
    let next = customPerm.next();
    if (!next) {
      break;
    }
    count++;
  }
  expect(count).toBe(6);
});

test('Generator', () => {
  let customPerm = new CustomPermutation(['a', 'b', 'c'], {}, {});
  let count = 0;
  let gen = null;
  gen = customPerm.generator();
  while (true) {
    let next = gen.next();
    if (next.done) {
      break;
    }
    count++;
  }

  expect(count).toBe(6);
});
