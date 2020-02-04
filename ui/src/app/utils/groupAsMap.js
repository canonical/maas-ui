/**
 * Group an array of objects by a key getter function into an ES6 Map.
 *
 * @param {array{}} arr - the array of objects to group
 * @param {function} keyGetter - the key getter function to group by, e.g item => item.name
 * @returns {Map} grouped Map
 */

export const groupAsMap = (arr, keyGetter) => {
  const map = new Map();
  arr.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};
