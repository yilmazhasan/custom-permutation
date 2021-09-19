import { PermutationGeneratorForSet } from './PermutationGeneratorForSet';
import { PermResultTypeEnum } from './Enums';

export class CustomPermutationGenerator {

  set: any[];
  setAsStr: string[];
  permutationGenOfSet: any;
  nextIndexList: number[] = [];
  choicesByIndexInSet = {};   // index of each choices in set
  history: any[] = [];    // Permutation history
  historyHashes: any[] = [];  // Permutation hashes, being used to distinguish new perm from olds
  current: any[] = []; // keeps the current perm of set
  cursor = 0;

  // choicesByIndex: wisheds, unChoicesByIndex: unwisheds type is not but like SlotForPerson[], since it is a object instead of array
  constructor(private elementList: any[],
    private choicesByIndex: object = {}, // ChoicesByIndex is relative to sub-sch so we need elementsIndexRel, a index list of sub-sch
    private nonChoicesByIndex: object = {}, // nonChoices is also relative
    private elementsOrderAbs?: any[], // Actual orders in final schdule
    private elementsIndexRel: any[] = [], // Actual relative orders in sub-schedule
    private passFunction?: Function,
    private randomizechoices?: boolean) {

    var indexList = Array(elementList.length).fill(0).map((el, ind) => ind);
    this.set = elementList.reduce((init, el, i) => elementList.indexOf(el) == i ? init.concat(el) : init, []);
    this.setAsStr = this.set.map(x => String(x));
    this.init();

    // debugger
    // Optimization: Take same element indexes and when removeing one remove all
    var indexesOfSameElements = {};
    elementList.forEach((element, i) => {
      indexesOfSameElements[i] = []
      // Zero means noone
      // if (element == 0) {
      //   // indexesOfSameElements[i] = [i]; // To make an illusion such that zero is different than zero, to make it possible to be consecutive
      //   return;
      // }

      elementList.forEach((innerElement, j) => {
        if (element == innerElement) {
          indexesOfSameElements[i].push(j);
        }
      });
    });

    // Can be uncomment, since it will increase the permutation number but it should be remain for exact results
    this.extendIndexesOfSameElements(this.choicesByIndex, indexesOfSameElements);
    // not make for choicesByIndex list so that options be little
    this.extendIndexesOfSameElements(this.nonChoicesByIndex, indexesOfSameElements);

    let choicesByIndexInSetFiltered = Object.keys(this.choicesByIndexInSet).filter(x => elementsIndexRel.indexOf(Number(x)) >= 0)
      .map(x => this.choicesByIndexInSet[x]);

    // Same like above
    // for(let i = 0; i < this.elementsIndexRel.length; i++) {
    //   choicesByIndexInSetFiltered[i] = this.choicesByIndexInSet[elementsIndexRel[i]]
    // }
    this.permutationGenOfSet = new PermutationGeneratorForSet(elementList, indexList, choicesByIndexInSetFiltered, indexesOfSameElements,
      elementsOrderAbs, passFunction, randomizechoices);
  }

  // collect indexes of same elements into nonChoicesByIndex array, eg, slot1 should be placed by person 1 whose indexes are 3,4,5
  extendIndexesOfSameElements(choicesByIndex, indexesOfSameElements) {

    if (!choicesByIndex) {
      return;
    }

    const choicesIndexKeys = Object.keys(choicesByIndex)
    for (let i = 0; i < choicesIndexKeys.length; i++) {
      const key = choicesIndexKeys[i];
      if (choicesByIndex[key]) {
        for (let j = 0; j < choicesByIndex[key].length; j++) {
          var ar = choicesByIndex[key].slice();
          // debugger
          if ((indexesOfSameElements[choicesByIndex[key][j]] || []).indexOf(choicesByIndex[key][j]) >= 0) {
            ar = ar.concat(indexesOfSameElements[choicesByIndex[key][j]])
          }
        }
        choicesByIndex[key] = ar ? ar.filter((el, i) => ar.indexOf(el) == i) : [];
      }
    }
  }

  // ? Need indexes to make a set, since element list may not be distinct
  init() {
    if (this.nonChoicesByIndex) {
      this.removeNonChoicesIndexes(); // Since set is changed to indexes, choices should be converted also to indexes
    }

    if (this.choicesByIndex) {
      this.setChoicesIndexesInSet(); // Since set is changed to indexes, choices should be converted also to indexes
    }

    this.completeMissingChoicesIndexes();
  }


  completeMissingChoicesIndexes() {
    var allIndexes = Array(this.elementList.length).fill(0).map((x, i) => i);

    for (let i = 0; i < this.elementList.length; i++) {
      if (!this.choicesByIndexInSet[i]) {
        this.choicesByIndexInSet[i] = allIndexes.slice();
      }
    }

  }

  // Index of choices in set
  setChoicesIndexesInSet() {

    Object.keys(this.choicesByIndex).forEach(key => {
      if (!this.choicesByIndex[key])
        return; //?? bu gives error
      var indexesInList = [];
      for (let j = 0; j < this.choicesByIndex[key].length; j++) {
        indexesInList = indexesInList.concat(this.getAllIndexesOfElementInList(String(this.choicesByIndex[key][j]), this.elementList));
      }
      this.choicesByIndexInSet[key] = indexesInList;
    });

  }

  removeNonChoicesIndexes() {

    var allIndexes = Array(this.elementList.length).fill(0).map((x, i) => i);

    Object.keys(this.nonChoicesByIndex).forEach(key => {
      var indexes = allIndexes.slice();
      for (let j = 0; j < this.nonChoicesByIndex[key].length; j++) {
        var indexesToRemove = this.getAllIndexesOfElementInList(this.nonChoicesByIndex[key][j], this.elementList);
        indexes = indexes.filter(x => indexesToRemove.indexOf(x) < 0);
      }
      this.choicesByIndexInSet[key] = indexes;
      // ? OR
      // this.choicesByIndex[key] = indexes; // but not working

    });

  }

  getAllIndexesOfElementInList(el, list) {
    var indexes = [];
    for (let i = 0; i < list.length; i++) {
      if (String(el) == String(list[i])) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  prev() {
    if (this.cursor > 1) {   // cursor-1 is current, cursor-2 is prev
      return this.history[--this.cursor - 1];
    }
  }

  next() {
    var nextDistinct;

    while (true) {
      nextDistinct = this.nextDistinct();
      if (nextDistinct && !nextDistinct.done) {
        if (nextDistinct.value) {
          return nextDistinct.value;
        }
        else {
          return [];
        }
      } else if (nextDistinct && nextDistinct.done) {
        return null;// PermResultTypeEnum.ENDOFPERMUTATION;
      }
    }

  }

  nextDistinct() {

    if (this.cursor < this.history.length) {
      return { value: this.history[this.cursor++], done: false };
    }

    let nextPerm = this.permutationGenOfSet.next();

    this.nextIndexList = nextPerm.value;
    var elList;

    if (this.nextIndexList && this.nextIndexList.length > 0) {
      elList = this.getElementListByInitialListIndexes(nextPerm.value);
      let hash = this.getHash(elList);
      if (this.historyHashes.indexOf(hash) < 0 && (!this.passFunction || this.passFunction(elList))) {
        this.current = elList;
        this.history.push(elList)
        this.historyHashes.push(hash);
        this.cursor++;
      } else {
        return false;
      }
    }

    return { done: nextPerm.done, value: elList }
  }

  saveCurrentToHistory() {
    this.history.push(this.current)
    let hash = this.getHash(this.current);
    this.historyHashes.push(hash);
    this.cursor++;
  }

  getHash(elList: any[]) {
    var hash = '';
    for (let i = 0; i < elList.length; i++) {
      for (let j = 0; j < i + 1; j++) {
        hash += String(elList[i]);
      }
    }
    return hash;
  }

  getElementListByInitialListIndexes(indexes) {
    if (!indexes || !indexes.length) {
      return [];
    }

    var elList = [];

    indexes.forEach(index => {
      // if(this.elementList[index]) // Can be added, but costly
      {
        elList.push(this.elementList[index]);
      }
    });

    return elList;
  }

  consecutiveDifferent(list: any[]) {
    for (let i = 1; i < list.length; i++) {
      if (list[i] == list[i - 1]) {
        return false;
      }
    }

    return true;
  }

  reset() {
    this.cursor = 0;
  }

  getSet() {
    return this.set || [];
  }

  isEmpty() {
    return !this.set || this.set.length === 0;
  }

  getCurrent() {
    if (this.cursor < this.history.length && this.cursor >= 0) {
      return this.history[this.cursor];
    } else {
      return null;
    }
  }

  last() {
    this.cursor = this.history.length - 1;

    return this.history[this.cursor];
  }

}
