import { Utils } from './Utils';

export class PermutationGeneratorForSet {

  choicesArraysInitial = []; // possible choices for each element for requested permutations
  choicesArrays = [];         // possible choices for each element for requested permutations
  numOfEl = 0;
  currentIndsOfChoices = [];  // indice array of current perm to compose
  currentElInd = 0;           // indice of current elemet to add in perm list
  newPerm = [];               // list for new permutation
  initialSet = [];            // original set for new permutation

  listIndexesAfterArrangement = [];
  indexesAndChoicesArrayLengthsSortedByLength;
  indexesAndChoicesArrayLengths: any[];
  actualAndPrevIndexesInPermAfterSortedByChoicesLength = {};

  elIsUsedDict = {};  // keeps the usage status of each set index as key

  constructor(private elementList: any[],
    private set: any[], // set of index
    private choicesByIndex?: object, private indexesOfSameElements?,
    private actualOrderOfElements?: any[], private passFunction?: Function, private randomizeChoices?: boolean) {
    // Which defines the actual orders of these elements, used as timeSlot
    // default orders are sequental, but in usage, they can be seperate from each other
    this.actualOrderOfElements = this.actualOrderOfElements || Array(set.length).fill(1).map((el, i) => i);
    // indexesofsameelements is position of every element by default
    this.indexesOfSameElements = this.indexesOfSameElements || Array(set.length).fill(1).map((el, i) => i);

    if (!this.validateParameters(set, choicesByIndex)) {
      return;
    }

    this.initialSet = set;
    set = set.reduce((init, el, i) => set.indexOf(el) == i ? init.concat(el) : init, []); // be sure for it to be set
    this.numOfEl = set.length;

    this.initChoicesArray();
    this.reorderListAndChoicesAccordingToChoicesCount();
    this.initPrevIndexes();
    this.currentIndsOfChoices[this.numOfEl - 1] = -1; // make last element as to be next

    this.init();
  }


  initPrevIndexes() {
    var keys = Object.keys(this.indexesAndChoicesArrayLengthsSortedByLength);
    for (let permInd = 0; permInd < keys.length; permInd++) {
      let elIndInPerm = this.indexesAndChoicesArrayLengthsSortedByLength[permInd].index;
      let prevElIndInPerm = this.indexesAndChoicesArrayLengthsSortedByLength.findIndex(x => x.index == elIndInPerm - 1);
      let nextElIndInPerm = this.indexesAndChoicesArrayLengthsSortedByLength.findIndex(x => x.index == elIndInPerm + 1);

      this.actualAndPrevIndexesInPermAfterSortedByChoicesLength[permInd] = {
        actualIndex: elIndInPerm,
        indexOfPrevInPerm: prevElIndInPerm,
        indexOfNextInPerm: nextElIndInPerm
      }

    }
  }

  isNewPermWithNewElementConsecutivelyDifferent(currentEl, elIndInChoices, elIndInPerm) {
    var newPerm = this.newPerm.slice();
    newPerm[elIndInPerm] = currentEl

    let actualOrderedNewPerm = this.revertResultPermToInitialOrder(newPerm);

    if (this.passFunction) {
      let elArray = [];
      actualOrderedNewPerm.forEach((elInd, i) => elArray[i] = this.elementList[elInd]);
      let pass = this.passFunction(elArray.filter(x => x));  // Remove undefineds, since some array elements are undefined when building
      return pass;

    }

    return true;
  }


  // Shouldn't be checked in this class, better to check in a high level, like custom permutation or listschuduler
  // Means previous actual element is not same with current one
  isNewPermWithNewElementConsecutivelyDifferent_(currentEl, elIndInChoices, elIndInPerm) {


    var newPerm = this.newPerm.slice();
    newPerm[elIndInPerm] = currentEl
    let actualOrderedNewPerm = this.revertResultPermToInitialOrder(newPerm);

    // this block can be used upon need or comment

    if (this.passFunction) {
      let elArray = [];
      actualOrderedNewPerm.forEach((elInd, i) => elArray[i] = this.elementList[elInd]);
      let pass = this.passFunction(elArray);

      return pass;
    }

    let actualOrderOfPrev = Number(this.actualOrderOfElements[0]);
    let prevEl = this.elementList[actualOrderOfPrev]
    let actualOrderOfCurr, currEl;

    for (let i = 1; i < actualOrderedNewPerm.length; i++) {
      actualOrderOfCurr = Number(this.actualOrderOfElements[i]);
      currEl = this.elementList[actualOrderedNewPerm[i]]

      if (currEl && prevEl && currEl != 0 && prevEl != 0 && Math.abs(actualOrderOfCurr - actualOrderOfPrev) == 1 && currEl == prevEl) {
        {
          return false;
        }
      }

      actualOrderOfPrev = actualOrderOfCurr;
      prevEl = currEl;
    }
    return true;
  }

  // Means previous actual element is not same with current one
  isPreviousElementDifferentOrCanSkipThisFn(currentEl, elIndInChoices, elIndInPerm) { // elInd : ind of el in newPerm


    let prevElIndInPerm = this.actualAndPrevIndexesInPermAfterSortedByChoicesLength[elIndInPerm].indexOfPrevInPerm // this.indexesAndChoicesArrayLengthsSortedByLength.indexOf(this.indexesAndChoicesArrayLengths.filter(x=>x.index == elIndInPerm-1)[0]);
    let nextElIndInPerm = this.actualAndPrevIndexesInPermAfterSortedByChoicesLength[elIndInPerm].indexOfNextInPerm // this.indexesAndChoicesArrayLengthsSortedByLength.indexOf(this.indexesAndChoicesArrayLengths.filter(x=>x.index == elIndInPerm-1)[0]);


    elIndInPerm = this.indexesAndChoicesArrayLengthsSortedByLength[elIndInPerm].index;
    prevElIndInPerm = this.indexesAndChoicesArrayLengthsSortedByLength.indexOf(this.indexesAndChoicesArrayLengths.filter(x => x.index == elIndInPerm - 1)[0]);


    if (elIndInPerm == 0 || !this.newPerm[prevElIndInPerm]) {
      return true;  // if not set yet, return true
    }

    if (this.actualOrderOfElements[elIndInPerm] - this.actualOrderOfElements[prevElIndInPerm] != 1) {
      return true;  // since this is not conseccutive, skip function
    }

    if (this.actualOrderOfElements[elIndInPerm] - this.actualOrderOfElements[prevElIndInPerm] == 1 &&
      (this.elementList[this.newPerm[elIndInPerm]] != this.elementList[this.newPerm[prevElIndInPerm]] &&
        this.indexesOfSameElements[this.newPerm[prevElIndInPerm]].indexOf(currentEl) == -1)) {
      return true;  // they are consecutive and different from each other and also different from sameElementIndexes
    }

    if (this.elementList[this.newPerm[prevElIndInPerm]] == 0 || this.elementList[currentEl] == 0) {
      return true;  // skip the zeros, since they can be consecutive
    }

    return false;
  }

  // Change choice arrays elements order to take low choices front to place them firstly
  reorderListAndChoicesAccordingToChoicesCount() {
    this.indexesAndChoicesArrayLengths = [];
    this.choicesArrays.forEach(((list, ind) => this.indexesAndChoicesArrayLengths.push({ index: ind, length: list.length })));
    // debugger
    this.indexesAndChoicesArrayLengthsSortedByLength = this.indexesAndChoicesArrayLengths.slice()
      .sort((el1, el2) => el1.length < el2.length ? -1 : el1.length == el2.length && el1.index < el2.index ? -1 : 1);
    var newChoicesArray = [];
    var newSet = [];

    for (let i = 0; i < this.indexesAndChoicesArrayLengthsSortedByLength.length; i++) {
      newChoicesArray[i] = this.choicesArrays[this.indexesAndChoicesArrayLengthsSortedByLength[i].index];
      newSet[i] = this.set[this.indexesAndChoicesArrayLengthsSortedByLength[i].index];
    }

    this.choicesArrays = newChoicesArray;
    this.choicesArraysInitial = JSON.parse(JSON.stringify(this.choicesArrays))
  }

  revertResultPermToInitialOrder(newPerm) {
    var resultPerm = [];

    for (let i = 0; i < newPerm.length; i++) {
      resultPerm[this.indexesAndChoicesArrayLengthsSortedByLength[i].index] = newPerm[i];
    }

    return resultPerm;
  }

  initChoicesArray() {
    this.choicesArrays = [];
    this.choicesArraysInitial = [];

    for (let i = 0; i < this.set.length; i++) {
      this.choicesArrays.push(this.choicesByIndex[i] && this.choicesByIndex[i].length ?
        this.choicesByIndex[i].slice() : this.set.slice());
      if (this.randomizeChoices) {
        Utils.shuffle(this.choicesArrays[i]);
      }
      this.choicesArraysInitial.push(this.choicesArrays[i].slice());
    }
  }

  init() {

    // Initialize the new permutation
    for (let i = 0; i < this.numOfEl; i++) {
      for (let j = 0; j < this.choicesArrays[i].length; j++) {

        if (this.newPerm.indexOf(this.choicesArrays[i][j]) < 0) {

          this.newPerm[i] = this.choicesArrays[i][j];
          this.elIsUsedDict[this.newPerm[i]] = true;  // used
          this.currentIndsOfChoices[i] = j;
          break;
        }
      }
    }

    // Remove last element so that algorithm resolve it
    this.currentIndsOfChoices[this.numOfEl - 1] = -1; // make last element as to be next
    this.elIsUsedDict[this.newPerm[this.numOfEl - 1]] = false;  // not-used
    this.newPerm[this.numOfEl - 1] = null;
  }

  next() {
    let nextPerm = this.getNextPerm();
    if (nextPerm) {
      // If nextPerm does not include empty item, any undefined
      // ?? Understand, sometimes there is an empty element, case should be detected
      while (nextPerm.filter(x => x || x == 0).length < nextPerm.length) {
        nextPerm = this.getNextPerm();
        if (!nextPerm || nextPerm.length == 0) {
          return { done: true };
        }
      }

      return { done: false, value: this.revertResultPermToInitialOrder(nextPerm) };

    } else {
      return { done: true };
    }
  }

  getNextPerm() {

    for (let i = this.numOfEl - 1; i >= 0 && i < this.numOfEl; i++) {

      // To make consecutives different
      let elIndInPerm = this.indexesAndChoicesArrayLengthsSortedByLength[i].index;
      let prevElIndInPerm = this.indexesAndChoicesArrayLengthsSortedByLength.indexOf(this.indexesAndChoicesArrayLengths.filter(x => x.index == elIndInPerm - 1)[0]);
      let choicesArray = [];

      try {
        choicesArray = this.choicesArraysInitial[i].filter(x => !this.elIsUsedDict[x]);
      } catch (error) {
      }
      let el = this.getAndSetPossibleNextElementForNewPerm(this.newPerm, choicesArray, this.currentIndsOfChoices, i);
      while (el == 'EXISTINARRAY' || el == 'TRIEDBEFORE') {
        el = this.getAndSetPossibleNextElementForNewPerm(this.newPerm, choicesArray, this.currentIndsOfChoices, i);
      }

      if (!el && el != 0) {   // if el is undefined or null
        if (this.newPerm.filter(x => x == null).length == 0) { // if it is done, return completed
          return this.newPerm.slice();
        }
        while (!this.goBack(this.newPerm, this.choicesArrays, this.currentIndsOfChoices, --i)) {
          if (i <= 0) { // if there is only one element, then i can be less than 0, that is negative
            // console.log('End of permutation!')
            return;
          }
        }
      } else {
        this.elIsUsedDict[this.newPerm[i]] = false;  // old one, not-used
        this.newPerm[i] = el;
        this.elIsUsedDict[this.newPerm[i]] = true; // new one, used

      }
    }

    return this.newPerm.slice();
  }

  goBack(newPerm, choicesArrays, currentIndsInChoices, elInd) {

    // reset chocies arrays until end, there should not be need but code is a little buggy
    choicesArrays[elInd] = (this.choicesArraysInitial[elInd] || []).slice()
    if (elInd + 1 < choicesArrays.length) {
      choicesArrays[elInd + 1] = (this.choicesArraysInitial[elInd + 1] || []).slice()
    }

    if (elInd >= 0 && elInd < this.numOfEl) {
      if (currentIndsInChoices[elInd] < choicesArrays[elInd].length - 1) {
        currentIndsInChoices[elInd + 1] = -1;	// Reset old
        this.elIsUsedDict[newPerm[elInd + 1]] = false
        newPerm[elInd + 1] = null;
        currentIndsInChoices[elInd]++;  // increment current
        if (
          !this.elIsUsedDict[choicesArrays[elInd][currentIndsInChoices[elInd]]]
          &&
          this.isNewPermWithNewElementConsecutivelyDifferent(choicesArrays[elInd][currentIndsInChoices[elInd]], currentIndsInChoices[elInd], elInd)
        ) {
          this.elIsUsedDict[newPerm[elInd]] = false // not-used
          newPerm[elInd] = choicesArrays[elInd][currentIndsInChoices[elInd]];
          this.elIsUsedDict[newPerm[elInd]] = true // used

          return true;
        } else {
          return this.goBack(newPerm, choicesArrays, currentIndsInChoices, elInd);
        }
      } else {
        currentIndsInChoices[elInd + 1] = -1;	// Reset old
        this.elIsUsedDict[newPerm[elInd + 1]] = false  // not-used
        newPerm[elInd + 1] = null;
        return false;
      }
    }
    // choicesArrays[elInd + 1] = this.choicesArraysInitial[elInd + 1].slice()

    return false;
  }

  getAndSetPossibleNextElementForNewPerm(newPerm, choices, currentIndsInChoices, elInd) {

    // debugger
    if (elInd >= this.numOfEl) {
      currentIndsInChoices[elInd] = 0;	// will go back
      return null;
    }

    // If current element index does not exist then set it to zero
    if (!(currentIndsInChoices[elInd] >= 0)) {
      currentIndsInChoices[elInd] = 0;    // try starting from 0
    } else {
      currentIndsInChoices[elInd]++;
    }

    if (currentIndsInChoices[elInd] >= 0 && currentIndsInChoices[elInd] < choices.length) {
      // If exist any where in new perm
      if (!this.isNewPermWithNewElementConsecutivelyDifferent(choices[currentIndsInChoices[elInd]], currentIndsInChoices[elInd], elInd)) {
        return 'EXISTINARRAY';
      }

      this.elIsUsedDict[newPerm[elInd]] = false
      newPerm[elInd] = choices[currentIndsInChoices[elInd]];
      this.elIsUsedDict[newPerm[elInd]] = true
      // from the choices list Remove the same elements with the one which is set right now
      this.choicesArrays[elInd] = this.choicesArrays[elInd].filter(x =>
        this.indexesOfSameElements[newPerm[elInd]] && this.indexesOfSameElements[newPerm[elInd]].indexOf(x) == -1)

      return choices[currentIndsInChoices[elInd]]
    } else {
      this.elIsUsedDict[newPerm[elInd]] = false

      currentIndsInChoices[elInd] = -1;
      newPerm[elInd] = null;
    }

    return undefined;
  }

  validateParameters(elementSet, choicesByIndex) {
    if (!elementSet || elementSet.length == 0) {
      console.warn('Element list to permutate should be provided!');
      return false;
    }

    let keys = Object.keys(choicesByIndex);

    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < choicesByIndex[keys[i]].length; j++) {
        if (elementSet.indexOf(choicesByIndex[keys[i]][j]) < 0) {
          console.warn('All choices should be in set!');
          return false;
        }
      }

    }

    return true;
  }

}
