import CustomPermutation from './CustomPermutation';

let customPerm = new CustomPermutation([], {}, {});
while (true) {
  const next = customPerm.next();

  if (!next) {
    break;
  }

  console.log(next);
}
