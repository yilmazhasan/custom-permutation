import { CustomPermutationGenerator } from "./CustomPermutationGenerator";

export default class CustomPermutation {

  customPermGen: CustomPermutationGenerator;
  constructor(
    private listToPermutate: any[],
    private choices: object,
    private nonChoices: object,
    private elementsOrderAbsolute?: any[],
    private elementsOrderRelative?: any[],
    private passFn?: Function
  ) {

    if (!elementsOrderAbsolute?.length) {
      elementsOrderAbsolute = new Array(listToPermutate.length, 0).map((x, i) => i);
    }

    if (!elementsOrderRelative?.length) {
      elementsOrderRelative = new Array(listToPermutate.length, 0).map((x, i) => i);
    }

    this.customPermGen = new CustomPermutationGenerator(listToPermutate, choices, nonChoices, elementsOrderAbsolute, elementsOrderRelative, passFn);
  }

}
