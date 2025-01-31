import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ZoneSelect from "./ZoneSelect";

import { zoneResolvers } from "@/app/api/query/zones.test";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithMockStore,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();
const mockServer = setupMockServer(zoneResolvers.listZones.handler());

beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  mockServer.resetHandlers();
});
afterAll(() => mockServer.close());

describe("ZoneSelect", () => {
  it("renders a list of all zones", async () => {
    renderWithMockStore(
      <Formik initialValues={{ zone: "" }} onSubmit={vi.fn()}>
        <ZoneSelect name="zone" />
      </Formik>
    );
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());

    expect(await screen.findByText("zone-1")).toBeInTheDocument();
    expect(screen.getByText("zone-2")).toBeInTheDocument();
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
