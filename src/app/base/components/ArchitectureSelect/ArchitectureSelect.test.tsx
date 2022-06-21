import { render, screen } from "@testing-library/react";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ArchitectureSelect, { Labels } from "./ArchitectureSelect";

import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ArchitectureSelect", () => {
  it("dispatches action to fetch architectures on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ architecture: "" }} onSubmit={jest.fn()}>
          <ArchitectureSelect name="architecture" />
        </Formik>
      </Provider>
    );

    expect(
      store
        .getActions()
        .some((action) => action.type === "general/fetchArchitectures")
    ).toBe(true);
  });

  it("disables select if architectures have not loaded", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          loaded: false,
        }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ architecture: "" }} onSubmit={jest.fn()}>
          <ArchitectureSelect name="architecture" />
        </Formik>
      </Provider>
    );

    expect(
      screen.getByRole("combobox", { name: Labels.DefaultLabel })
    ).toBeDisabled();
  });
});
