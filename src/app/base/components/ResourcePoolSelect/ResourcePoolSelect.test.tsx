import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ResourcePoolSelect from "./ResourcePoolSelect";

import type { RootState } from "app/store/root/types";
import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore, screen } from "testing/utils";

const mockStore = configureStore<RootState>();

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
    renderWithMockStore(
      <Formik initialValues={{ pool: "" }} onSubmit={jest.fn()}>
        <ResourcePoolSelect name="pool" />
      </Formik>,
      { state }
    );

    const pools = screen.getAllByRole("option", { name: /Pool [1-2]/i });
    expect(pools).toHaveLength(2);
    expect(pools[0]).toHaveTextContent("Pool 1");
    expect(pools[1]).toHaveTextContent("Pool 2");
  });

  it("dispatches action to fetch resource pools on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={{ pool: "" }} onSubmit={jest.fn()}>
        <ResourcePoolSelect name="pool" />
      </Formik>,
      { store }
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
    renderWithMockStore(
      <Formik initialValues={{ pool: "" }} onSubmit={jest.fn()}>
        <ResourcePoolSelect name="pool" />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
