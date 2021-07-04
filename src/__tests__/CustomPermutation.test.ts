import { CustomPermutation } from "../../lib";

test('Custom Permutation', () => {
    const testList = [1, 2, 3];
    expect(CustomPermutation(testList)).toBe(`${testList}`);
});