import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DomainSelect, { Labels } from "./DomainSelect";

import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("DomainSelect", () => {
  it("dispatches action to fetch domains on load", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ domain: "" }} onSubmit={vi.fn()}>
          <DomainSelect name="domain" />
        </Formik>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "domain/fetch")
    ).toBe(true);
  });

  it("disables select if domains have not loaded", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        loaded: false,
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ domain: "" }} onSubmit={vi.fn()}>
          <DomainSelect name="domain" />
        </Formik>
      </Provider>
    );

    expect(
      screen.getByRole("combobox", { name: Labels.DefaultLabel })
    ).toBeDisabled();
  });
});
