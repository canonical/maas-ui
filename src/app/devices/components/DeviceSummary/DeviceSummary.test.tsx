import configureStore from "redux-mock-store";

import DeviceSummary from "./DeviceSummary";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithProviders } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceSummary", () => {
  it("shows a spinner if device has not loaded yet", () => {
    const state = factory.rootState({
      device: factory.deviceState({ items: [] }),
    });
    const store = mockStore(state);
    renderWithProviders(<DeviceSummary systemId="abc123" />, { store });

    expect(screen.getByTestId("loading-device")).toBeInTheDocument();
    expect(screen.queryByTestId("device-summary")).not.toBeInTheDocument();
  });

  it("shows device summary once loaded", () => {
    const state = factory.rootState({
      device: factory.deviceState({
        items: [factory.device({ system_id: "abc123" })],
      }),
    });
    const store = mockStore(state);
    renderWithProviders(<DeviceSummary systemId="abc123" />, { store });

    expect(screen.getByTestId("device-summary")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-device")).not.toBeInTheDocument();
  });
});
