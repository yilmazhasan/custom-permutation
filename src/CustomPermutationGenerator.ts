import { PermutationGeneratorForSet } from './PermutationGeneratorForSet';

export class CustomPermutationGenerator {
  set: any[];
  permutationGenOfSet: any;
  nextIndexList: number[] = [];
  finalChoicesByIndexInSet = {};
  history: any[] = [];
  historyHashes: any[] = [];
  current: any[] = [];
  cursor = 0;

  constructor(
    private elementList: any[],
    private choicesByIndex: object = {},
    private nonChoicesByIndex: object = {},
    private elementsOrderAbsolute?: any[],
    private passFunction?: (items: any[]) => boolean,
  ) {
    const indexList = Array(elementList.length)
      .fill(0)
      .map((_, ind) => ind);
    this.set = Array.from(new Set(elementList));

    const indexesOfSameElements = {};

    elementList.forEach((element, i) => {
      indexesOfSameElements[i] = [];

      elementList.forEach((el, j) => {
        if (element === el) {
          indexesOfSameElements[i].push(j);
        }
      });
    });

    this.extendIndexesOfSameElements(this.choicesByIndex, indexesOfSameElements);
    this.extendIndexesOfSameElements(this.nonChoicesByIndex, indexesOfSameElements);

    if (this.nonChoicesByIndex) {
      this.removeNonChoicesIndexes();
    }

    if (this.choicesByIndex) {
      this.setChoicesIndexesInSet();
    }

    this.completeRestOfIndexes();

    this.permutationGenOfSet = new PermutationGeneratorForSet(
      elementList,
      indexList,
      this.finalChoicesByIndexInSet,
      indexesOfSameElements,
      this.elementsOrderAbsolute,
      passFunction,
    );
  }

  removeNonChoicesIndexes() {
    const allIndexes = Array(this.elementList.length)
      .fill(0)
      .map((x, i) => i);
    Object.keys(this.nonChoicesByIndex).forEach((key) => {
      let indexes = allIndexes.slice();

      for (const el of this.nonChoicesByIndex[key]) {
        const indexesToRemove = this.getAllIndexesOfElementInList(el, this.elementList);
        indexes = indexes.filter((x) => indexesToRemove.indexOf(x) < 0);
      }

      this.finalChoicesByIndexInSet[key] = indexes;
    });
  }

  setChoicesIndexesInSet() {
    for (const key in this.choicesByIndex) {
      if (!this.choicesByIndex[key]) {
        continue;
      }

      let indexesInList = [];
      for (const el of this.choicesByIndex[key]) {
        indexesInList = indexesInList.concat(this.getAllIndexesOfElementInList(el, this.elementList));
      }
      this.finalChoicesByIndexInSet[key] = indexesInList;
    }
  }

  getAllIndexesOfElementInList(el, list) {
    const indexes = [];
    for (let i = 0; i < list.length; i++) {
      if (String(el) === String(list[i])) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  completeRestOfIndexes() {
    const allIndexes = Array(this.elementList.length)
      .fill(0)
      .map((x, i) => i);

    for (let i = 0; i < this.elementList.length; i++) {
      if (!this.finalChoicesByIndexInSet[i]) {
        this.finalChoicesByIndexInSet[i] = allIndexes.slice();
      }
    }
  }

  extendIndexesOfSameElements(choicesByIndex, indexesOfSameElements) {
    if (!choicesByIndex) {
      return;
    }

    for (const key in choicesByIndex) {
      if (choicesByIndex[key]) {
        let clone;
        for (const anotherKey of choicesByIndex[key]) {
          clone = choicesByIndex[key].slice();
          if ((indexesOfSameElements[anotherKey] || []).indexOf(anotherKey) >= 0) {
            clone = clone.concat(indexesOfSameElements[anotherKey]);
          }
        }
        choicesByIndex[key] = clone ? clone.filter((el, idx) => clone.indexOf(el) === idx) : [];
      }
    }
  }

  prev() {
    if (this.cursor > 1) {
      // cursor-1 is current, cursor-2 is prev
      return this.history[--this.cursor - 1];
    }
  }

  next() {
    let nextDistinctPerm = this.nextDistinct();

    return !nextDistinctPerm.done ? nextDistinctPerm.value : null;
  }

  nextDistinct() {
    if (this.cursor < this.history.length) {
      return { value: this.history[this.cursor++], done: false };
    }

    const nextPerm = this.permutationGenOfSet.next();

    this.nextIndexList = nextPerm.value;
    let elList;

    if (this.nextIndexList && this.nextIndexList.length > 0) {
      elList = this.getElementListByInitialListIndexes(nextPerm.value);
      const hash = this.getHash(elList);
      if (this.historyHashes.indexOf(hash) < 0 && (!this.passFunction || this.passFunction(elList))) {
        this.current = elList;
        this.history.push(elList);
        this.historyHashes.push(hash);
        this.cursor++;
      } else {
        return this.nextDistinct();
      }
    }

    return { done: nextPerm.done, value: elList };
  }

  saveCurrentToHistory() {
    this.history.push(this.current);
    const hash = this.getHash(this.current);
    this.historyHashes.push(hash);
    this.cursor++;
  }

  getHash(elList: any[]) {
    let hash = '';
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

    const elList = [];

    indexes.forEach((index) => {
      // if(this.elementList[index]) // Can be added, but costly
      {
        elList.push(this.elementList[index]);
      }
    });

    return elList;
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
