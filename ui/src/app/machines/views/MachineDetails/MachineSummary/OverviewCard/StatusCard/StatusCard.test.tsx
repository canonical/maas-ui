import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StatusCard from "./StatusCard";

import type { RootState } from "app/store/root/types";
import { NodeStatus, NodeStatusCode } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StatusCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          data: osInfoFactory(),
        }),
      }),
      machine: machineStateFactory({
        items: [],
      }),
    });
  });

  it("renders a locked machine", () => {
    const machine = machineDetailsFactory();
    machine.status = NodeStatus.TESTING;
    machine.locked = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("locked")).toBeInTheDocument();
  });

  it("renders os info", () => {
    const machine = machineDetailsFactory();
    machine.osystem = "ubuntu";
    machine.distro_series = "focal";
    machine.show_os_info = true;
    state.general.osInfo.data = osInfoFactory({
      releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
    });
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("os-info")).toHaveTextContent(
      'Ubuntu 20.04 LTS "Focal Fossa"'
    );
  });

  it("renders a failed test warning", () => {
    const machine = machineDetailsFactory();
    machine.testing_status.status = 3;

    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("failed-test-warning")).toHaveTextContent(
      "Warning: Some tests failed, use with caution."
    );
  });

  it("displays an error message for broken machines", () => {
    const machine = machineDetailsFactory({
      error_description: "machine is on fire",
      status: NodeStatus.BROKEN,
      status_code: NodeStatusCode.BROKEN,
    });
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("error-description")).toHaveTextContent(
      "machine is on fire"
    );
  });

  it("does not display a sync status for deployed machines with hardware sync disabled", () => {
    const machine = machineDetailsFactory({
      enable_hw_sync: false,
      status: NodeStatus.DEPLOYED,
    });
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByText(/Periodic hardware sync/)
    ).not.toBeInTheDocument();
  });

  it("displays a sync status and link to docs for deployed machines with hardware sync enabled", () => {
    const machine = machineDetailsFactory({
      enable_hw_sync: true,
      status: NodeStatus.DEPLOYED,
      sync_interval: 900,
    });
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText("Periodic hardware sync enabled")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByRole("button", {
        name: "more about periodic hardware sync",
      })
    );
    /* TODO: Enable this check after adding docs links https://github.com/canonical-web-and-design/app-tribe/issues/787 */
    expect(
      screen.queryByRole("link", { name: "Hardware sync docs" })
    ).not.toBeInTheDocument();
  });

  it("displays deployed hardware sync interval in a correct format", () => {
    const machine = machineDetailsFactory({
      enable_hw_sync: true,
      status: NodeStatus.DEPLOYED,
      sync_interval: 900,
    });

    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    userEvent.click(
      screen.getByRole("button", { name: "more about periodic hardware sync" })
    );
    expect(
      screen.getByText(/This machine hardware info is synced every 15 minutes./)
    ).toBeVisible();
  });
});
