import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import StorageNotifications from "./StorageNotifications";

import { NodeStatusCode } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  nodeDisk as diskFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("StorageNotifications", () => {
  let state;
  let machine;

  beforeEach(() => {
    machine = machineDetailsFactory({
      disks: [diskFactory()],
      locked: false,
      osystem: "ubuntu",
      permissions: ["edit"],
      status_code: NodeStatusCode.READY,
      storage_layout_issues: [],
      system_id: "abc123",
    });
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
      }),
    });
  });

  it("handles no notifications", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <StorageNotifications id="abc123" />
      </Provider>,
      { route: "/machine/abc123", store }
    );

    expect(screen.queryByText("Notification")).toBeNull();
  });

  it("can display a commissioning error", () => {
    machine.disks = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <StorageNotifications id="abc123" />
      </Provider>,
      { route: "/machine/abc123", store }
    );

    expect(
      screen.queryByText(
        "No storage information. Commission this machine to gather storage information."
      )
    ).toBeInTheDocument();
  });

  it("can display a machine state error", () => {
    machine.status_code = NodeStatusCode.NEW;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <StorageNotifications id="abc123" />
      </Provider>,
      { route: "/machine/abc123", store }
    );

    expect(
      screen.queryByText(
        "Storage configuration cannot be modified unless the machine is Ready or Allocated."
      )
    ).toBeInTheDocument();
  });

  it("can display an OS storage configuration notification", () => {
    machine.osystem = "windows";
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <StorageNotifications id="abc123" />
      </Provider>,
      { route: "/machine/abc123", store }
    );

    expect(
      screen.queryByText(
        /Custom storage configuration is only supported on Ubuntu, CentOS, and RHEL./i
      )
    ).toBeInTheDocument();
  });

  it("can display a bcache ZFS error", () => {
    machine.osystem = "centos";
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <StorageNotifications id="abc123" />
      </Provider>,
      { route: "/machine/abc123", store }
    );

    expect(
      screen.queryByText(/Bcache and ZFS are only supported on Ubuntu./i)
    ).toBeInTheDocument();
  });

  it("can display a list of storage layout issues", () => {
    machine.storage_layout_issues = ["it's bad", "it won't work"];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <StorageNotifications id="abc123" />
      </Provider>,
      { route: "/machine/abc123", store }
    );

    expect(screen.queryByText("it's bad")).toBeInTheDocument();
    expect(screen.queryByText("it won't work")).toBeInTheDocument();
  });
});
