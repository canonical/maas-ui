import configureStore from "redux-mock-store";

import NetworkNotifications from "./NetworkNotifications";

import { NodeStatus } from "app/store/types/node";
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
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("NetworkNotifications", () => {
  let state;
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
    state.machine.items = [
      machineDetailsFactory({
        on_network: true,
        osystem: "ubuntu",
        status: NodeStatus.NEW,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const route = { route: "/machine/abc123" };
    renderWithBrowserRouter(<NetworkNotifications id="abc123" />, route, store);
    expect(screen.queryByRole("notification")).toBeNull();
  });

  it("can show a network connection message", () => {
    state.machine.items = [
      machineDetailsFactory({
        on_network: false,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const route = { route: "/machine/abc123" };
    renderWithBrowserRouter(<NetworkNotifications id="abc123" />, route, store);
    expect(
      screen.getByText(/Machine must be connected to a network./i)
    ).toBeInTheDocument();
  });

  it("can show a permissions message", () => {
    state.machine.items[0].status = NodeStatus.DEPLOYING;
    const store = mockStore(state);
    const route = { route: "/machine/abc123" };
    renderWithBrowserRouter(<NetworkNotifications id="abc123" />, route, store);
    expect(
      screen.getByText(/Interface configuration cannot be modified/i)
    ).toBeInTheDocument();
  });

  it("can display a custom image message", () => {
    state.machine.items[0].osystem = "custom";
    const store = mockStore(state);
    const route = { route: "/machine/abc123" };
    renderWithBrowserRouter(<NetworkNotifications id="abc123" />, route, store);
    expect(
      screen.getByText(/Custom images may require special preparation/i)
    ).toBeInTheDocument();
  });
});
