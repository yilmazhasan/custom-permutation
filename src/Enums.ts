export enum SlotTypeEnum {
  Weekday = 1,
  Holiday = 2
}

export enum MonthEnum {
  January = 0,    // JS starts with 0
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11
}


export enum CheckFunctionsErrorTypeEnum {
  SamePersonInSameDayInBothList,
  ConsecutiveSamePersonInSameList,
  SamePersonAtNorthWest,
  SamePersonAtNorthEast,  // same at one step up of next list
  SamePersonAtSouthEast,  //
  SamePersonAtSouthWest,  //
}

// Permutation Results
export enum PermResultTypeEnum {
  FOUND = 1,
  TRYNEXT,
  ENDOFPERMUTATION,
}

export enum CheckResultEnum {
  TRYNEXT = 1,
  TRYNEXTWD,
  TRYNEXTHD,
  TRYNEXTHDANDWDBOTH,
  NOSOLUTION,
  NOTTRIEDYET
}