/**
 * Simple sort objects by key value.
 *
 * @param key - the key of the objects to sort by
 * @param config - config object
 * @param config.reverse - whether to reverse the results
 * @returns sort function
 */
export const simpleSortByKey =
  <O, K extends keyof O>(
    key: K,
    { reverse } = { reverse: false }
  ): ((a: O, b: O) => number) =>
  (a: O, b: O) => {
    if (a[key] > b[key]) return reverse ? -1 : 1;
    if (a[key] < b[key]) return reverse ? 1 : -1;
    return 0;
  };
