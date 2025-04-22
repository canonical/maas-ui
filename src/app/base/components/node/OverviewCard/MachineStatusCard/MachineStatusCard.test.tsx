import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import MachineStatusCard from "./MachineStatusCard";

import docsUrls from "@/app/base/docsUrls";
import type { RootState } from "@/app/store/root/types";
import { NodeStatus, NodeStatusCode } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import {
  userEvent,
  render,
  screen,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("MachineStatusCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      general: factory.generalState({
        osInfo: factory.osInfoState({
          data: factory.osInfo(),
        }),
      }),
      machine: factory.machineState({
        items: [],
      }),
    });
  });

  it("renders a locked machine", () => {
    const machine = factory.machineDetails();
    machine.status = NodeStatus.TESTING;
    machine.locked = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineStatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("locked")).toBeInTheDocument();
  });

  it("renders os info", () => {
    const machine = factory.machineDetails();
    machine.osystem = "ubuntu";
    machine.distro_series = "focal";
    machine.show_os_info = true;
    state.general.osInfo.data = factory.osInfo({
      releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
    });
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineStatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("os-info")).toHaveTextContent(
      'Ubuntu 20.04 LTS "Focal Fossa"'
    );
  });

  it("renders a failed test warning", () => {
    const machine = factory.machineDetails();
    machine.testing_status = 3;

    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineStatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("failed-test-warning")).toHaveTextContent(
      "Warning: Some tests failed, use with caution."
    );
  });

  it("displays an error message for broken machines", () => {
    const machine = factory.machineDetails({
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
          <MachineStatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("error-description")).toHaveTextContent(
      "machine is on fire"
    );
  });

  it("does not display a sync status for deployed machines with hardware sync disabled", () => {
    const machine = factory.machineDetails({
      enable_hw_sync: false,
      status: NodeStatus.DEPLOYED,
    });
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineStatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByText(/Periodic hardware sync/)
    ).not.toBeInTheDocument();
  });

  it("displays a sync status and link to docs for deployed machines with hardware sync enabled", async () => {
    const machine = factory.machineDetails({
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
          <MachineStatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText("Periodic hardware sync enabled")
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", {
        name: "more about periodic hardware sync",
      })
    );
    const hardwareSyncDocs = screen.getByRole("link", {
      name: "Hardware sync docs",
    });
    expect(hardwareSyncDocs).toBeInTheDocument();
    expect(hardwareSyncDocs).toHaveAttribute("href", docsUrls.hardwareSync);
  });

  it("displays deployed hardware sync interval in a correct format", async () => {
    const machine = factory.machineDetails({
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
          <MachineStatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "more about periodic hardware sync" })
    );
    expect(
      screen.getByText(/This machine hardware info is synced every 15 minutes./)
    ).toBeVisible();
  });

  it("indicates when a machine is deployed ephemerally", () => {
    const machine = factory.machineDetails({
      ephemeral_deploy: true,
      status: NodeStatus.DEPLOYED,
      status_code: NodeStatusCode.DEPLOYED,
      sync_interval: 900,
    });
    const store = mockStore(state);

    renderWithBrowserRouter(<MachineStatusCard machine={machine} />, {
      store,
      route: "/machines",
    });

    expect(
      screen.getByRole("heading", { name: /deployed in memory/i })
    ).toBeInTheDocument();
  });
});
