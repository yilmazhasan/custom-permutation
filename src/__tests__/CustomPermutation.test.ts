import CustomPermutation from "../../lib";

test('Custom Permutation', () => {
    let customPerm = new CustomPermutation(['a', 'b', 'c'], {}, {});
    let perms = [];
    let next;
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
    let perms = [];
    let next;
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
    let perms = [];
    let next;
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
    let perms = [];
    let next;
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
    let perms = [];
    let next;
    while (true) {
        next = customPerm.customPermGen.next();
        console.log(next);
        if (next) {
            perms.push(next);
        } else {
            break;
        }
    }

    expect(perms.length).toBe(3);
});
