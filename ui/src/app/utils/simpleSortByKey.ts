type KeyedObject<K extends string> = Partial<Record<K, unknown>>;

/**
 * Simple sort objects by key value.
 *
 * @param key - the key of the objects to sort by
 * @returns sort function
 */
export const simpleSortByKey = <K extends string>(
  attr: K
): ((a: KeyedObject<K>, b: KeyedObject<K>) => number) => (
  a: KeyedObject<K>,
  b: KeyedObject<K>
) => {
  if (a[attr] > b[attr]) return 1;
  if (a[attr] < b[attr]) return -1;
  return 0;
};
