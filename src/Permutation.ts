import * as  G from 'generatorics';


export class Permutation {

  uniformedArr: any[];  // uniformly distributed version of list
  permGen: any;
  previous: any[] = [];
  current: any[] = [];
  cursor = 0;
  history: any[] = [];

  constructor(private list: any[], private stepCount: number = 1, private dayIndexes: number[]) {
    this.init(list, stepCount, dayIndexes);
  }

  init(list: any[], stepCount: number = 1, dayIndexes: number[]) {
    if (list.length === 0) {
      console.warn('Empty list permutation!')
    }
    this.uniformedArr = this.distributeItemsUniformly(list.slice());
    this.permGen = this.giveNotConsecutives(this.uniformedArr.slice());
    // this.permGen = this.giveNotConsecutives(this.list.slice());
  }

  prev() {
    // cursor points the one after current element, index of cursor-1 points to the last given element, so current cursor - 2 is prev
    if (this.cursor > 1) {
      this.cursor -= 1;
    } else {
      alert('at very first of perm');
    }

    return this.history[this.cursor - 1];
  }

  next() {
    // if cursor does not point the new element, then give from history
    if (this.cursor < this.history.length) {
      return this.history[this.cursor++];
    }

    Object.assign(this.previous, this.current);
    let next = this.permGen.next() || {};
    Object.assign(this.current, next.value);
    /*prev-> this.cursor ? this.history[this.cursor-1] : [] */
    while (this.areArraysEqual(this.previous, this.current)) {
      // console.log("equal", this.previous, this.current)
      Object.assign(this.previous, this.current);
      let obj = this.permGen.next();
      if (!obj || obj.done) {
        return;
      }
      Object.assign(this.current, obj.value);
    }

    this.history.push(this.current.slice());
    this.cursor++;


    return this.current;
  }

  // do not delete history, since it will be needed for prev()
  reset() {
    // this.permGen = this.giveNotConsecutives(this.uniformedArr);
    this.cursor = 0;
  }

  getList() {
    return this.list || [];
  }

  isEmpty() {
    return this.list.length === 0 || !this.list;
  }

  last() {
    this.cursor = this.history.length - 1;
  }

  areArraysEqual(arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  // old
  distributeItemsUniformly_old(arr) {
    var freqs = {};
    var uniformed = [];

    for (let i = 0; i < arr.length; i++) {
      freqs[arr[i]] = freqs[arr[i]] + 1 || 1;
    }

    var keys = Object.keys(freqs);
    var consumedKeyCount = 0;

    while (consumedKeyCount < keys.length) {
      consumedKeyCount = 0;
      for (let key of keys) {
        if (freqs[key]) {
          uniformed.push(key)
          freqs[key]--
        }
        else {
          consumedKeyCount++;
        }
      }
    }

    return uniformed;
  }

  getFreqs(arr) {
    const freqs = {};

    for (const item of arr) {
      if (freqs[item]) {
        freqs[item]++;
      } else {
        freqs[item] = 1;
      }
    }

    return freqs;
  }

  // first element will be max valued
  getKeysSortedByFreq(freq) {

    let keys = Object.keys(freq);
    const keysSortedByFreq = [];
    const valuesSortedByFreq = [];

    while (keys.length > 0) {
      let keyOfMax = keys[0];
      let max = freq[keyOfMax];
      for (const key of keys) {
        if (max < freq[key]) {
          keyOfMax = key;
          max = freq[key];
        }
      }

      keysSortedByFreq.push(keyOfMax);
      valuesSortedByFreq.push(max);
      keys = keys.filter(x => x !== keyOfMax);
    }
    return keysSortedByFreq;
  }

  distributeItemsUniformly(arr) {

    const freqs = this.getFreqs(arr);

    console.log(freqs);

    let size = 0;

    const keys = this.getKeysSortedByFreq(freqs);
    console.log(keys);

    for (const key of keys) {
      size += freqs[key];
    }

    const uniformedArr = Array(size).fill(undefined);

    for (const key of keys) {

      const freqOfKey = freqs[key];
      const start = uniformedArr.indexOf(undefined);

      let shift = 0;
      const freqOfEl = freqs[key];
      const shiftAmount = Math.ceil(size / freqOfEl);
      const index = 0;
      while (freqs[key]) {
        let index = start + shift;
        // if el on index is not empty, go next
        while (uniformedArr[index] && index < size) {
          index++;
        }
        // if until end no any empty, go prev
        if (index === size) {
          while (uniformedArr[index] && index >= 0) {
            index--;
          }
        }

        if (index < size && index >= 0) {
          uniformedArr[index] = key;
          shift += shiftAmount;
          freqs[key]--;
        } else {
          console.log('distributeUniformly: Element is not set to an index!');
          break;
        }
      }

    }

    return uniformedArr;
    // console.log(uniformedArr);
  }

  // give permutations
  *giveNotConsecutives(arrToBePermutated) {

    var differentConsecutives = [];
    var perms = G.permutation(arrToBePermutated);
    var perm;

    let i = 0;

    while (true) {

      // console.log("yielding", (perm || {}).value)

      // yield by step of 100
      let j = 0;
      while (j++ < this.stepCount) {
        perm = perms.next();
      }

      if (!perm || perm.done) {
        break;
      }

      if (!this.anyConsecutiveNonZeroItem(perm.value)) {
        differentConsecutives.push(perm.value.slice());
        yield (perm.value);
      } else {
        // skip 2
        // let j = 0;
        // while (j++ < 2) {
        //   perms.next();
        // }
      }
    }
  }

  // Since holidays and weekdays are seperated, doesn't sense to check consecutively
  anyConsecutiveNonZeroItem(arr) {

    // for (let i = 1; i < arr.length; i++) {

    //   if (Number(arr[i]) && arr[i] === arr[i - 1]) {
    //     return true;
    //   }
    // }

    for (let i = 1; i < this.dayIndexes.length; i++) {
      if (Math.abs(this.dayIndexes[i] - this.dayIndexes[i - 1]) == 1) { // means consecutive
        if (arr[i] == arr[i - 1] && Number(arr[i])) {
          return true;
        }
      }
    }

    return false;
  }

}
