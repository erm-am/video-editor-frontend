export const binarySearch = (items, findValue, comparator) => {
  let left = 0;
  let right = items.length - 1;
  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);
    const comparisonResult = comparator(items[middle], findValue);
    if (comparisonResult.EQUAL) return items[middle];
    if (comparisonResult.GREATER_THAN) left = middle + 1;
    if (comparisonResult.LESS_THAN) right = middle - 1;
  }
  return false;
};

export const compareTimeRange = (current, findValue) => {
  if (findValue >= current.startMs && findValue <= current.endMs) {
    return { EQUAL: true };
  } else if (findValue > current.startMs) {
    return { GREATER_THAN: true };
  } else if (findValue < current.startMs) {
    return { LESS_THAN: true };
  }
};
