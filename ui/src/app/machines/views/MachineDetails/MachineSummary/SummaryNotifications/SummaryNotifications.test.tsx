import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SummaryNotifications from "./SummaryNotifications";

import type { RootState } from "app/store/root/types";
import { PowerState } from "app/store/types/enum";
import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SummaryNotifications", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64"],
          loaded: true,
        }),
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            architecture: "amd64",
            events: [machineEventFactory()],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("handles no notifications", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("machine-notifications-list")
    ).toBeEmptyDOMElement();
  });

  it("can display a power error", () => {
    state.machine.items = [
      machineDetailsFactory({
        architecture: "amd64",
        events: [
          machineEventFactory({
            description: "machine timed out",
          }),
        ],
        power_state: PowerState.ERROR,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      /Script - machine timed out/i
    );
  });

  it("can display a rack connection error", () => {
    state.general.powerTypes.data = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /no rack controller is currently connected/i
    );
  });

  it("can display an architecture error", () => {
    state.machine.items[0].architecture = "";
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      /This machine currently has an invalid architecture/i
    );
  });

  it("can display a boot images error", () => {
    state.general.architectures = architecturesStateFactory({
      data: [],
      loaded: true,
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /No boot images have been imported/i
    );
  });

  it("can display a hardware status", () => {
    state.machine.items[0].cpu_count = 0;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      /Commission this machine to get CPU/i
    );
  });

  it("can display a failed hardware sync notification", () => {
    state.machine.items = [
      machineDetailsFactory({
        architecture: "amd64",
        system_id: "abc123",
        is_sync_healthy: false,
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      /This machine was not synced when it was scheduled./i
    );
    expect(
      within(screen.getByRole("status")).getByRole("link", {
        name: "machine logs",
      })
    ).toBeInTheDocument();
  });
});
