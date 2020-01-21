/**
 * Simple sort objects by key value.
 *
 * @param {string} key - the key of the objects to sort by
 * @returns {function} sort function
 */

export const simpleSortByKey = attr => {
  return function(a, b) {
    if (a[attr] > b[attr]) return 1;
    if (a[attr] < b[attr]) return -1;
    return 0;
  };
};
