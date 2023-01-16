import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MinimumKernelSelect, { Labels } from "./MinimumKernelSelect";

import {
  hweKernelsState as hweKernelsStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("MinimumKernelSelect", () => {
  it("dispatches action to fetch hwe kernels on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ minKernel: "" }} onSubmit={jest.fn()}>
          <MinimumKernelSelect name="minKernel" />
        </Formik>
      </Provider>
    );

    expect(
      store
        .getActions()
        .some((action) => action.type === "general/fetchHweKernels")
    ).toBe(true);
  });

  it("disables select if hwe kernels have not loaded", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        hweKernels: hweKernelsStateFactory({
          loaded: false,
        }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ minKernel: "" }} onSubmit={jest.fn()}>
          <MinimumKernelSelect name="minKernel" />
        </Formik>
      </Provider>
    );

    expect(
      screen.getByRole("combobox", { name: Labels.Select })
    ).toBeDisabled();
  });
});
