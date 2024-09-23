export const lessonCycle = (index: number) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) {
    indentationLevel = cycleIndex;
  } else if (cycleIndex <= 4) {
    indentationLevel = 4 - cycleIndex;
  } else if (cycleIndex <= 6) {
    indentationLevel = cycleIndex - 4;
  } else {
    indentationLevel = cycleIndex - 8;
  }

  return indentationLevel * 40;
};
