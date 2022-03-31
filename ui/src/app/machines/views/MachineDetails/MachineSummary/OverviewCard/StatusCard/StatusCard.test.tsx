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

  it("displays a message when the hardware sync is enabled", () => {
    const machine = machineDetailsFactory({
      enable_hw_sync: true,
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
  });

  it("displays deployed hardware sync interval and link to docs in the hardware sync tooltip", () => {
    const machine = machineDetailsFactory({
      enable_hw_sync: true,
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
      screen.getByText(/This machine hardware info is synced every 24 hours/)
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Hardware sync docs" })
    ).toBeVisible();
  });
});
