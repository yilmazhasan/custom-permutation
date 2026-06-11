import { PermutationGeneratorForSet } from './PermutationGeneratorForSet';

export class CustomPermutationGenerator<T> {
  set: T[];
  permutationGenOfSet: PermutationGeneratorForSet;
  nextIndexList: number[] = [];
  finalChoicesByIndexInSet: { [key: string]: number[] } = {};
  history: T[][] = [];
  historyHashes: string[] = [];
  current: T[] = [];
  cursor = 0;

  constructor(
    private elementList: T[],
    private choicesByIndex: Record<number, T[]>,
    private nonChoicesByIndex: Record<number, T[]>,
    private elementsOrderAbsolute?: number[],
    private passFunction?: (items: T[]) => boolean,
  ) {
    const indexList = Array(elementList.length)
      .fill(0)
      .map((_, ind) => ind);
    this.set = Array.from(new Set(elementList));

    const indexesOfSameElements: Record<number, number[]> = {};

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
      elementList as any[],
      indexList,
      this.finalChoicesByIndexInSet,
      indexesOfSameElements,
      this.elementsOrderAbsolute,
      passFunction as ((items: any[]) => boolean) | undefined,
    );
  }

  removeNonChoicesIndexes(): void {
    const allIndexes = Array(this.elementList.length)
      .fill(0)
      .map((x, i) => i);
    Object.keys(this.nonChoicesByIndex).forEach((key) => {
      let indexes = allIndexes.slice();

      for (const el of this.nonChoicesByIndex[+key]) {
        const indexesToRemove = this.getAllIndexesOfElementInList(el, this.elementList);
        indexes = indexes.filter((x) => indexesToRemove.indexOf(x) < 0);
      }

      this.finalChoicesByIndexInSet[key] = indexes;
    });
  }

  setChoicesIndexesInSet(): void {
    for (const key in this.choicesByIndex) {
      if (!this.choicesByIndex[+key]) {
        continue;
      }

      let indexesInList: number[] = [];
      for (const el of this.choicesByIndex[+key]) {
        indexesInList = indexesInList.concat(this.getAllIndexesOfElementInList(el, this.elementList));
      }
      this.finalChoicesByIndexInSet[key] = indexesInList;
    }
  }

  getAllIndexesOfElementInList(el: unknown, list: unknown[]): number[] {
    const indexes: number[] = [];
    for (let i = 0; i < list.length; i++) {
      if (String(el) === String(list[i])) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  completeRestOfIndexes(): void {
    const allIndexes = Array(this.elementList.length)
      .fill(0)
      .map((x, i) => i);

    for (let i = 0; i < this.elementList.length; i++) {
      if (!this.finalChoicesByIndexInSet[i]) {
        this.finalChoicesByIndexInSet[i] = allIndexes.slice();
      }
    }
  }

  extendIndexesOfSameElements(
    choicesByIndex: Record<string | number, any[]>,
    indexesOfSameElements: Record<number, number[]>,
  ): void {
    if (!choicesByIndex) {
      return;
    }

    for (const key in choicesByIndex) {
      if (choicesByIndex[key]) {
        let clone: any[] | undefined;
        for (const anotherKey of choicesByIndex[key]) {
          clone = choicesByIndex[key].slice();
          if ((indexesOfSameElements[anotherKey] || []).indexOf(anotherKey) >= 0) {
            clone = clone.concat(indexesOfSameElements[anotherKey]);
          }
        }
        choicesByIndex[key] = clone ? clone.filter((el, idx) => clone!.indexOf(el) === idx) : [];
      }
    }
  }

  prev(): T[] | undefined {
    if (this.cursor > 1) {
      // cursor-1 is current, cursor-2 is prev
      return this.history[--this.cursor - 1];
    }
    return undefined;
  }

  next(): T[] | null {
    const nextDistinctPerm = this.nextDistinct();
    return !nextDistinctPerm.done ? (nextDistinctPerm.value ?? null) : null;
  }

  nextDistinct(): { value: T[] | undefined; done: boolean } {
    if (this.cursor < this.history.length) {
      return { value: this.history[this.cursor++], done: false };
    }

    const nextPerm = this.permutationGenOfSet.next();

    this.nextIndexList = nextPerm.value ?? [];
    let elList: T[] | undefined;

    if (this.nextIndexList && this.nextIndexList.length > 0) {
      elList = this.getElementListByInitialListIndexes(nextPerm.value!);
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

  saveCurrentToHistory(): void {
    this.history.push(this.current);
    const hash = this.getHash(this.current);
    this.historyHashes.push(hash);
    this.cursor++;
  }

  getHash(elList: T[]): string {
    return JSON.stringify(elList);
  }

  getElementListByInitialListIndexes(indexes: number[]): T[] {
    if (!indexes || !indexes.length) {
      return [];
    }

    const elList: T[] = [];

    indexes.forEach((index) => {
      elList.push(this.elementList[index]);
    });

    return elList;
  }

  reset(): void {
    this.cursor = 0;
  }

  getSet(): T[] {
    return this.set || [];
  }

  isEmpty(): boolean {
    return !this.set || this.set.length === 0;
  }

  getCurrent(): T[] | null {
    if (this.cursor < this.history.length && this.cursor >= 0) {
      return this.history[this.cursor];
    } else {
      return null;
    }
  }

  last(): T[] {
    this.cursor = this.history.length - 1;
    return this.history[this.cursor];
  }
}
