import StorageNotifications from "./StorageNotifications";

import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeStatusCode } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  nodeDisk as diskFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("StorageNotifications", () => {
  let state: RootState;
  let machine: MachineDetails;

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
    renderWithBrowserRouter(<StorageNotifications id="abc123" />, {
      route: "/machine/abc123",
      state,
    });

    expect(
      screen.getByTestId("machine-notifications-list")
    ).toBeEmptyDOMElement();
  });

  it("can display a commissioning error", () => {
    machine.disks = [];
    renderWithBrowserRouter(<StorageNotifications id="abc123" />, {
      route: "/machine/abc123",
      state,
    });

    expect(
      screen.getByText(
        "No storage information. Commission this machine to gather storage information."
      )
    ).toBeInTheDocument();
  });

  it("can display a machine state error", () => {
    machine.status_code = NodeStatusCode.NEW;
    renderWithBrowserRouter(<StorageNotifications id="abc123" />, {
      route: "/machine/abc123",
      state,
    });

    expect(
      screen.getByText(
        "Storage configuration cannot be modified unless the machine is Ready or Allocated."
      )
    ).toBeInTheDocument();
  });

  it("can display an OS storage configuration notification", () => {
    machine.osystem = "windows";
    renderWithBrowserRouter(<StorageNotifications id="abc123" />, {
      route: "/machine/abc123",
      state,
    });

    expect(
      screen.getByText(
        /Custom storage configuration is only supported on Ubuntu, CentOS, and RHEL./i
      )
    ).toBeInTheDocument();
  });

  it("can display a bcache ZFS error", () => {
    machine.osystem = "centos";
    renderWithBrowserRouter(<StorageNotifications id="abc123" />, {
      route: "/machine/abc123",
      state,
    });

    expect(
      screen.getByText(/Bcache and ZFS are only supported on Ubuntu./i)
    ).toBeInTheDocument();
  });

  it("can display a list of storage layout issues", () => {
    machine.storage_layout_issues = ["it's bad", "it won't work"];
    renderWithBrowserRouter(<StorageNotifications id="abc123" />, {
      route: "/machine/abc123",
      state,
    });

    expect(screen.getByText("it's bad")).toBeInTheDocument();
    expect(screen.getByText("it won't work")).toBeInTheDocument();
  });
});
