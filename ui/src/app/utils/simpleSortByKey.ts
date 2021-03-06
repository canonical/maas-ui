/**
 * Simple sort objects by key value.
 *
 * @param key - the key of the objects to sort by
 * @returns sort function
 */
export const simpleSortByKey = <O, K extends keyof O>(
  attr: K
): ((a: O, b: O) => number) => (a: O, b: O) => {
  if (a[attr] > b[attr]) return 1;
  if (a[attr] < b[attr]) return -1;
  return 0;
};
