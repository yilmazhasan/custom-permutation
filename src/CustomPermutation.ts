import { CustomPermutationGenerator } from "./CustomPermutationGenerator";

export default class CustomPermutation {

  customPermGen: CustomPermutationGenerator;

  constructor(
    private listToPermutate: any[],
    private choices: object,
    private nonChoices: object,
    private elementsOrderAbsolute?: any[],
    private passFn?: (items: any[]) => boolean
  ) {

    if (!elementsOrderAbsolute?.length) {
      elementsOrderAbsolute = new Array(listToPermutate.length, 0).map((x, i) => i);
    }

    this.customPermGen = new CustomPermutationGenerator(
      this.listToPermutate,
      this.choices,
      this.nonChoices,
      this.elementsOrderAbsolute,
      this.passFn
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
