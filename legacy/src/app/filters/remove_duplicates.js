/**
 * @param {Array} arr - array of objects
 * @param {String} prop - object key to determine uniqueness
 */
const removeDuplicates = (arr, prop) => {
  if (!Array.isArray(arr)) {
    return;
  }

  return arr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

export default removeDuplicates;
