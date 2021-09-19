export class Utils {

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }


  static shuffle(array, swapTimes = array.length) {
    var currentIndex = swapTimes, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  static kWayMerge(array2d, k) {
    var result = [];
    var step = Math.floor(array2d.length / k);

    //divide the array into k part and merge
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < step; j++) {
        result[i * step + j] = array2d[i + j * k]
      }
    }

    //remaining
    for (let i = result.length; i < array2d.length; i++) {
      result[i] = array2d[i];
    }

    return result;
  }

  static divideListEqualFreq(list: number[]) {
    var freqs = {};

    var list1 = [];
    var list2 = [];

    for (let i = 0; i < list.length; i++) {
      if (freqs[list[i]])
        freqs[list[i]] = freqs[list[i]] + 1;
      else
        freqs[list[i]] = 1;
    }

    var keys = Object.keys(freqs)

    for (let i = 0; i < keys.length; i++) {
      var smallNum = Math.floor(freqs[keys[i]] / 2);
      var bigNum = freqs[keys[i]] - smallNum;
      var bigList = list1.length > list2.length ? list1 : list2;
      var smallList = list1.length > list2.length ? list2 : list1;

      for (let j = 0; j < bigNum; j++) {
        smallList.push(keys[i]);
      }

      for (let j = 0; j < smallNum; j++) {
        bigList.push(keys[i]);
      }

    }

    return [smallList, bigList];
  }

  static trim(item) {
    if (item.length) {
      return item.slice(2) as number;
    }

    return item as number;
  }


}