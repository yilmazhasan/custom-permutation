import CustomPermutation from './CustomPermutation';

let customPerm = new CustomPermutation([], {}, {});
let count = 0;

while (true) {
    let next = customPerm.next();

    if (!next) {
        break;
    }

    count++;
}

module.exports = CustomPermutation;
