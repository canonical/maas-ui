import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ArchitectureSelect, { Labels } from "./ArchitectureSelect";

import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("ArchitectureSelect", () => {
  it("dispatches action to fetch architectures on load", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ architecture: "" }} onSubmit={vi.fn()}>
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
    const state = factory.rootState({
      general: factory.generalState({
        architectures: factory.architecturesState({
          loaded: false,
        }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ architecture: "" }} onSubmit={vi.fn()}>
          <ArchitectureSelect name="architecture" />
        </Formik>
      </Provider>
    );

    expect(
      screen.getByRole("combobox", { name: Labels.DefaultLabel })
    ).toBeDisabled();
  });
});
