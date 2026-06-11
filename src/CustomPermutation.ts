import { CustomPermutationGenerator } from './CustomPermutationGenerator';

export default class CustomPermutation<T> {
  customPermGen: CustomPermutationGenerator<T>;

  constructor(
    private listToPermutate: T[],
    private choices: Record<number, T[]>,
    private nonChoices: Record<number, T[]>,
    private elementsOrderAbsolute?: number[],
    private passFn?: (items: T[]) => boolean,
  ) {
    if (!elementsOrderAbsolute?.length) {
      elementsOrderAbsolute = Array.from(listToPermutate).map((x, i) => i);
    }

    this.customPermGen = new CustomPermutationGenerator<T>(
      this.listToPermutate,
      this.choices,
      this.nonChoices,
      this.elementsOrderAbsolute,
      this.passFn,
    );
  }

  next() {
    return this.customPermGen.next();
  }

  *generator() {
    let nextPerm = null;

    while (true) {
      nextPerm = this.customPermGen.next();
      if (nextPerm) {
        yield nextPerm;
      } else {
        break;
      }
    }
  }
}
