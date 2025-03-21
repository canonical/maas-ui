import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ResourcePoolSelect from "./ResourcePoolSelect";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithMockStore, screen } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ResourcePoolSelect", () => {
  it("renders a list of all resource pools in state", () => {
    renderWithMockStore(
      <Formik initialValues={{ pool: "" }} onSubmit={vi.fn()}>
        <ResourcePoolSelect name="pool" />
      </Formik>
    );

    const pools = screen.getAllByRole("option", { name: /Pool [1-2]/i });
    expect(pools).toHaveLength(2);
    expect(pools[0]).toHaveTextContent("Pool 1");
    expect(pools[1]).toHaveTextContent("Pool 2");
  });

  it("dispatches action to fetch resource pools on load", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={{ pool: "" }} onSubmit={vi.fn()}>
        <ResourcePoolSelect name="pool" />
      </Formik>,
      { store }
    );

    expect(
      store.getActions().some((action) => action.type === "resourcepool/fetch")
    ).toBe(true);
  });

  it("disables select if resource pools have not loaded", () => {
    renderWithMockStore(
      <Formik initialValues={{ pool: "" }} onSubmit={vi.fn()}>
        <ResourcePoolSelect name="pool" />
      </Formik>
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
