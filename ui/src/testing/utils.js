import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";

/**
 * Assert that some JSX from Enzyme is equal to some provided JSX.
 * @param {Object} actual - Some JSX from Enzyme.
 * @param {Object} expected - Some JSX provided in the test.
 */
export const compareJSX = (actual, expected) => {
  const actualOutput = actual.debug();
  // If the very first child of a component is another component then this
  // will render that components markup, but we want to shallow render it.
  // By wrapping the expected JSX in a div we stop enzyme from rendering the
  // supplied component and then we compare against the actual output.
  const expectedOutput = shallow(<div>{expected}</div>)
    .children()
    .debug();
  expect(actualOutput).toBe(expectedOutput);
};

/**
 * Replace objects in an array with objects that have new values, given a match
 * criteria.
 * @param {Array} array - Array to be reduced.
 * @param {String} key - Object key to compare the match criteria e.g. "name".
 * @param {String} match - Match criteria e.g. "Bob".
 * @param {Object} newValues - Values to insert or update in the object.
 * @returns {Array} The reduced array.
 */
export const reduceInitialState = (array, key, match, newValues) => {
  return array.reduce((acc, item) => {
    if (item[key] === match) {
      acc.push({
        ...item,
        ...newValues,
      });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};

/**
 * Fixes the error...
 * Warning: An update to Foo inside a test was not wrapped in act(...).\
 * https://github.com/enzymejs/enzyme/issues/2073
 * @param {ReactWrapper} wrapper The wrapper output from the enzyme `mount` command.
 * @returns {Promise} completion of wrapper update.
 */
export const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
    wrapper.update();
  });
};
