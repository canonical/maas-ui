import { render } from "@testing-library/react";
import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ResourcePoolSelect from "./ResourcePoolSelect";
import { renderWithBrowserRouter } from "./testing/utils";

import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ResourcePoolSelect", () => {
  it("renders a list of all resource pools in state", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        items: [
          resourcePoolFactory({ id: 101, name: "Pool 1" }),
          resourcePoolFactory({ id: 202, name: "Pool 2" }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const { container } = render(
      renderWithBrowserRouter(
        <Formik initialValues={{ pool: "" }} onSubmit={jest.fn()}>
          <ResourcePoolSelect name="pool" />
        </Formik>,
        { store, route: "" }
      )
    );

    expect(container.querySelector("select[name='pool']")).toMatchSnapshot();
  });

  it("dispatches action to fetch resource pools on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      renderWithBrowserRouter(
        <Formik initialValues={{ pool: "" }} onSubmit={jest.fn()}>
          <ResourcePoolSelect name="pool" />
        </Formik>,
        { store, route: "" }
      )
    );

    expect(
      store.getActions().some((action) => action.type === "resourcepool/fetch")
    ).toBe(true);
  });

  it("disables select if resource pools have not loaded", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const { container } = render(
      renderWithBrowserRouter(
        <Formik initialValues={{ pool: "" }} onSubmit={jest.fn()}>
          <ResourcePoolSelect name="pool" />
        </Formik>,
        { store, route: "" }
      )
    );

    expect(container.querySelector("select[name='pool']").disabled).toBe(true);
  });
});
