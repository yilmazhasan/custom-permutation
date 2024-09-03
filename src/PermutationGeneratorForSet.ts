export class PermutationGeneratorForSet {

  choicesArraysInitial = [];  // possible choices for each element for requested permutations
  choicesArrays = [];         // possible choices for each element for requested permutations
  size = 0;
  currentIndsOfChoices = [];  // indice array of current perm to compose
  currentElInd = 0;           // indice of current elemet to add in perm list
  newPerm = [];
  initialIndexList = [];      // original set for new permutation

  indexesAndChoicesCountsSortedByLength;
  indexesAndChoicesCounts: any[];

  visitedDict = {};

  constructor(
    private elementList: any[],
    private indexList: any[],
    private choicesByIndex?: object,
    private indexesOfSameElements?,
    private actualOrderOfElements?: any[],
    private passFunction?: (items: any[]) => boolean) {

    this.actualOrderOfElements = this.actualOrderOfElements || Array(indexList.length).fill(1).map((el, i) => i);
    this.indexesOfSameElements = this.indexesOfSameElements || Array(indexList.length).fill(1).map((el, i) => i);

    if (!this.validateParameters(indexList, choicesByIndex)) {
      return;
    }

    indexList = Array.from(new Set(indexList));
    this.initialIndexList = indexList;
    this.size = indexList.length;

    this.initChoicesArray();
    this.reorderListAndChoicesAccordingToChoicesCount();
    this.currentIndsOfChoices[this.size - 1] = -1;

    this.init();
  }

  isNewPermutationPassingFunction(currentEl, elIndInPerm) {
    const newPerm = this.newPerm.slice();
    newPerm[elIndInPerm] = currentEl

    const actualOrderedNewPerm = this.revertResultPermToInitialOrder(newPerm);

    if (this.passFunction) {
      const elArray = [];
      actualOrderedNewPerm.forEach((elInd, i) => elArray[i] = this.elementList[elInd]);
      const passed = this.passFunction(elArray.filter(x => x));  // Remove nulls, since some array elements are undefined when building
      return passed;

    }

    return true;
  }

  // Change choice arrays elements order to take low choices front to place them firstly
  reorderListAndChoicesAccordingToChoicesCount() {
    this.indexesAndChoicesCounts = [];
    this.choicesArrays.forEach(((list, ind) => this.indexesAndChoicesCounts.push({ index: ind, length: list.length })));

    this.indexesAndChoicesCountsSortedByLength = this.indexesAndChoicesCounts.slice()
      .sort((el1, el2) => el1.length < el2.length ? -1 : el1.length === el2.length && el1.index < el2.index ? -1 : 1);
    const newChoicesArray = [];
    const newSet = [];

    for (let i = 0; i < this.indexesAndChoicesCountsSortedByLength.length; i++) {
      newChoicesArray[i] = this.choicesArrays[this.indexesAndChoicesCountsSortedByLength[i].index];
      newSet[i] = this.indexList[this.indexesAndChoicesCountsSortedByLength[i].index];
    }

    this.choicesArrays = newChoicesArray;
    this.choicesArraysInitial = JSON.parse(JSON.stringify(this.choicesArrays))
  }

  initChoicesArray() {
    this.choicesArrays = [];
    this.choicesArraysInitial = [];

    for (let i = 0; i < this.indexList.length; i++) {
      this.choicesArrays.push(this.choicesByIndex[i] && this.choicesByIndex[i].length ?
        this.choicesByIndex[i].slice() : this.indexList.slice());
      this.choicesArraysInitial.push(this.choicesArrays[i].slice());
    }
  }

  init() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.choicesArrays[i].length; j++) {

        if (this.newPerm.indexOf(this.choicesArrays[i][j]) < 0) {

          this.newPerm[i] = this.choicesArrays[i][j];
          this.visitedDict[this.newPerm[i]] = true;  // used
          this.currentIndsOfChoices[i] = j;
          break;
        }
      }
    }

    this.currentIndsOfChoices[this.size - 1] = -1;
    this.visitedDict[this.newPerm[this.size - 1]] = false;
    this.newPerm[this.size - 1] = null;
  }

  next() {
    let nextPerm = this.getNextPerm();
    if (nextPerm) {
      while (nextPerm.filter(x => x || x === 0).length < nextPerm.length) {
        nextPerm = this.getNextPerm();
        if (!nextPerm || nextPerm.length === 0) {
          return { done: true };
        }
      }

      return { done: false, value: this.revertResultPermToInitialOrder(nextPerm) };

    } else {
      return { done: true };
    }
  }

  getNextPerm() {
    for (let i = this.size - 1; i >= 0 && i < this.size; i++) {

      let choicesArray = [];

      choicesArray = this.choicesArraysInitial[i].filter(x => !this.visitedDict[x]);

      const el = this.getAndSetPossibleNextElementForNewPerm(this.newPerm, choicesArray, this.currentIndsOfChoices, i);

      if (el === undefined) {
        if (!this.newPerm.some(x=>x === null)) {
          return this.newPerm.slice();
        }

        while (!this.goBack(this.newPerm, this.choicesArrays, this.currentIndsOfChoices, --i)) {
          if (i <= 0) {
            return undefined;
          }
        }
      }
      else {
        this.newPerm[i] = el;
        this.visitedDict[this.newPerm[i]] = true;
      }
    }

    return this.newPerm.slice();
  }

  goBack(newPerm, choicesArrayWithIndexes, selectedIndexesForPerm, elInd) { 
   
    if (elInd + 1 < choicesArrayWithIndexes.length) {
      choicesArrayWithIndexes[elInd + 1] = this.choicesArraysInitial[elInd + 1].slice()
      selectedIndexesForPerm[elInd + 1] = -1;
      this.visitedDict[newPerm[elInd + 1]] = false
      newPerm[elInd + 1] = null;
    }
    
    if (elInd >= 0 && elInd < this.size) {
      choicesArrayWithIndexes[elInd] = this.choicesArraysInitial[elInd].slice();

      if(selectedIndexesForPerm[elInd] === choicesArrayWithIndexes[elInd].length - 1) {
        return false;
      }
      else {
        selectedIndexesForPerm[elInd]++;

        if (!this.visitedDict[choicesArrayWithIndexes[elInd][selectedIndexesForPerm[elInd]]]
          && this.isNewPermutationPassingFunction(choicesArrayWithIndexes[elInd][selectedIndexesForPerm[elInd]], elInd)) {

          this.visitedDict[newPerm[elInd]] = false;
          newPerm[elInd] = choicesArrayWithIndexes[elInd][selectedIndexesForPerm[elInd]];
          this.visitedDict[newPerm[elInd]] = true;

          return true;
        } else {
          return this.goBack(newPerm, choicesArrayWithIndexes, selectedIndexesForPerm, elInd);
        }
      }
    }
  }

  getAndSetPossibleNextElementForNewPerm(newPerm, choices, currentIndsInChoices, elInd) {

    if (currentIndsInChoices[elInd] < 0) {
      currentIndsInChoices[elInd] = 0;
    } else {
      currentIndsInChoices[elInd]++;
    }

    if (currentIndsInChoices[elInd] >= 0 && currentIndsInChoices[elInd] < choices.length) {
      if (!this.isNewPermutationPassingFunction(choices[currentIndsInChoices[elInd]], elInd)) {
        return this.getAndSetPossibleNextElementForNewPerm(newPerm, choices, currentIndsInChoices, elInd) ;
      }

      newPerm[elInd] = choices[currentIndsInChoices[elInd]];
      this.visitedDict[newPerm[elInd]] = true

      this.choicesArrays[elInd] = this.choicesArrays[elInd].filter(x =>
        this.indexesOfSameElements[newPerm[elInd]] && this.indexesOfSameElements[newPerm[elInd]].indexOf(x) === -1)

      return choices[currentIndsInChoices[elInd]]

    } else {
      this.visitedDict[newPerm[elInd]] = false
      currentIndsInChoices[elInd] = -1;
      newPerm[elInd] = null;
      return undefined;
    }
  }

  validateParameters(elementSet, choicesByIndex) {
    if (!elementSet || elementSet.length === 0) {
      return false;
    }

    for (const key in choicesByIndex) {
      if(!choicesByIndex[key]) {
        continue;
      }

      for (const anotherKey of choicesByIndex[key]) {
        if (elementSet.indexOf(anotherKey) < 0) {
          return false;
        }
      }
    }

    return true;
  }

  revertResultPermToInitialOrder(newPerm) {
    const resultPerm = [];

    for (let i = 0; i < newPerm.length; i++) {
      resultPerm[this.indexesAndChoicesCountsSortedByLength[i].index] = newPerm[i];
    }

    return resultPerm;
  }
}
