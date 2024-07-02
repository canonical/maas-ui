import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ZoneSelect from "./ZoneSelect";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithMockStore, screen, setupMockServer } from "@/testing/utils";

const mockStore = configureStore<RootState>();
const mockZonesData = [
  factory.zone({ id: 1, name: "Zone 1" }),
  factory.zone({ id: 2, name: "Zone 2" }),
];
const { mockGet } = setupMockServer();

describe("ZoneSelect", () => {
  it("renders a list of all zones", async () => {
    mockGet("zones", mockZonesData);

    renderWithMockStore(
      <Formik initialValues={{ zone: "" }} onSubmit={vi.fn()}>
        <ZoneSelect name="zone" />
      </Formik>
    );

    expect(await screen.findByText("Zone 1")).toBeInTheDocument();
    expect(screen.getByText("Zone 2")).toBeInTheDocument();
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
