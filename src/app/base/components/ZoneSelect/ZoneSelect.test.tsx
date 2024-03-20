import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ZoneSelect from "./ZoneSelect";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithMockStore, screen } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ZoneSelect", () => {
  it("renders a list of all zones in state", () => {
    const state = factory.rootState({
      zone: factory.zoneState({
        genericActions: factory.zoneGenericActions({ fetch: "success" }),
        items: [
          factory.zone({ id: 101, name: "Pool 1" }),
          factory.zone({ id: 202, name: "Pool 2" }),
        ],
      }),
    });

    renderWithMockStore(
      <Formik initialValues={{ zone: "" }} onSubmit={vi.fn()}>
        <ZoneSelect name="zone" />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("combobox", { name: /zone/i })).toBeInTheDocument();
  });

  it("dispatches action to fetch zones on load", () => {
    const state = factory.rootState();
    const store = mockStore(state);

    renderWithMockStore(
      <Formik initialValues={{ zone: "" }} onSubmit={vi.fn()}>
        <ZoneSelect name="zone" />
      </Formik>,
      { store }
    );
    expect(
      store.getActions().some((action) => action.type === "zone/fetch")
    ).toBe(true);
  });

  it("disables select if zones have not loaded", () => {
    const state = factory.rootState({
      zone: factory.zoneState({
        genericActions: factory.zoneGenericActions({ fetch: "idle" }),
      }),
    });
    const store = mockStore(state);

    renderWithMockStore(
      <Formik initialValues={{ zone: "" }} onSubmit={vi.fn()}>
        <ZoneSelect name="zone" />
      </Formik>,
      { store }
    );

    expect(
      screen.getByRole("combobox", { name: new RegExp("zone", "i") })
    ).toBeDisabled();
  });
});
