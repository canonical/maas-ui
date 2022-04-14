import type { ValueOf } from "@canonical/react-components";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { ReactWrapper } from "enzyme";
import { shallow } from "enzyme";
import type { FormikHelpers, FormikValues } from "formik";
import { Formik } from "formik";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import type { AnyObject } from "app/base/types";
import type { RootState } from "app/store/root/types";

/**
 * Assert that some JSX from Enzyme is equal to some provided JSX.
 * @param {Object} actual - Some JSX from Enzyme.
 * @param {Object} expected - Some JSX provided in the test.
 */
export const compareJSX = (
  actual: ReactWrapper,
  expected: ReactWrapper
): void => {
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
export const reduceInitialState = <I,>(
  array: I[],
  key: keyof I,
  match: ValueOf<I>,
  newValues: Partial<I>
): I[] => {
  return array.reduce<I[]>((acc, item) => {
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
export const waitForComponentToPaint = async (
  wrapper: ReactWrapper
): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
    wrapper.update();
  });
};

/**
 * A utility to submit our custom FormikForm component.
 */
export const submitFormikForm = (
  wrapper: ReactWrapper,
  values: AnyObject = {},
  helpers: Partial<FormikHelpers<FormikValues>> = {}
): void => {
  const formikHelpers = {
    resetForm: jest.fn(),
    ...helpers,
  } as FormikHelpers<FormikValues>;
  const onSubmit = wrapper.find(Formik).prop("onSubmit");
  // In strict mode this is correctly inferred as a function so can be use with
  // `.invoke("onSubmit")` but with strict mode turned off we first have to be
  // sure it is a function.
  if (typeof onSubmit === "function") {
    act(() => {
      onSubmit(values, formikHelpers);
    });
  }
};

type WrapperProps = { state: RootState };

const BrowserRouterWithProvider = ({
  children,
  state,
}: WrapperProps & { children: React.ReactElement }) => {
  const getMockStore = (state: RootState) => {
    const mockStore = configureStore();
    return mockStore(state);
  };

  return (
    <Provider store={getMockStore(state)}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const WithMockStoreProvider = ({
  children,
  state,
}: WrapperProps & { children: React.ReactElement }) => {
  const getMockStore = (state: RootState) => {
    const mockStore = configureStore();
    return mockStore(state);
  };
  return <Provider store={getMockStore(state)}>{children}</Provider>;
};

export const renderWithBrowserRouter = (
  ui: React.ReactElement,
  options: RenderOptions & {
    wrapperProps: WrapperProps;
    route: string;
  }
): RenderResult => {
  window.history.pushState({}, "", options.route);

  return render(ui, {
    wrapper: (props) => (
      <BrowserRouterWithProvider {...props} {...options.wrapperProps} />
    ),
    ...options,
  });
};

export const renderWithMockStore = (
  ui: React.ReactElement,
  options: RenderOptions & {
    state: RootState;
  }
): RenderResult => {
  const rendered = render(ui, {
    wrapper: (props) => (
      <WithMockStoreProvider {...props} state={options.state} />
    ),
    ...options,
  });
  return {
    ...rendered,
  };
};

export const getUrlParam: URLSearchParams["get"] = (param: string) =>
  new URLSearchParams(window.location.search).get(param);
