import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StorageNotifications from "./StorageNotifications";

import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeStatusCode } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Notification").exists()).toBe(false);
  });

  it("can display a commissioning error", () => {
    machine.disks = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Notification").prop("children")).toBe(
      "No storage information. Commission this machine to gather storage information."
    );
  });

  it("can display a machine state error", () => {
    machine.status_code = NodeStatusCode.NEW;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Notification").prop("children")).toBe(
      "Storage configuration cannot be modified unless the machine is Ready or Allocated."
    );
  });

  it("can display an OS storage configuration notification", () => {
    machine.osystem = "windows";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Notification").at(0).prop("children")).toBe(
      "Custom storage configuration is only supported on Ubuntu, CentOS, and RHEL."
    );
  });

  it("can display a bcache ZFS error", () => {
    machine.osystem = "centos";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Notification").prop("children")).toBe(
      "Bcache and ZFS are only supported on Ubuntu."
    );
  });

  it("can display a list of storage layout issues", () => {
    machine.storage_layout_issues = ["it's bad", "it won't work"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Notification").length).toBe(2);
    expect(wrapper.find("Notification").at(0).prop("children")).toBe(
      "it's bad"
    );
    expect(wrapper.find("Notification").at(1).prop("children")).toBe(
      "it won't work"
    );
  });
});
