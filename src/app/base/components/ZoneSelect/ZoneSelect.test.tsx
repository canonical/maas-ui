import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ZoneSelect from "./ZoneSelect";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithMockStore, screen } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("ZoneSelect", () => {
  it("renders a list of all zones in state", () => {
    const state = rootStateFactory({
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
        items: [
          zoneFactory({ id: 101, name: "Pool 1" }),
          zoneFactory({ id: 202, name: "Pool 2" }),
        ],
      }),
    });

    renderWithMockStore(
      <Formik initialValues={{ zone: "" }} onSubmit={jest.fn()}>
        <ZoneSelect name="zone" />
      </Formik>,
      { state }
    );

    expect(
      screen.getByRole("combobox", { name: new RegExp("zone", "i") })
    ).toMatchSnapshot();
  });

  it("dispatches action to fetch zones on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);

    renderWithMockStore(
      <Formik initialValues={{ zone: "" }} onSubmit={jest.fn()}>
        <ZoneSelect name="zone" />
      </Formik>,
      { store }
    );
    expect(
      store.getActions().some((action) => action.type === "zone/fetch")
    ).toBe(true);
  });

  it("disables select if zones have not loaded", () => {
    const state = rootStateFactory({
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "idle" }),
      }),
    });
    const store = mockStore(state);

    renderWithMockStore(
      <Formik initialValues={{ zone: "" }} onSubmit={jest.fn()}>
        <ZoneSelect name="zone" />
      </Formik>,
      { store }
    );

    expect(
      screen.getByRole("combobox", { name: new RegExp("zone", "i") })
    ).toBeDisabled();
  });
});
