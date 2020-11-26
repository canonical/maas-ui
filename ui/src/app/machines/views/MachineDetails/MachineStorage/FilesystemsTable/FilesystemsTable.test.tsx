import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { normaliseFilesystem } from "../utils";

import FilesystemsTable from "./FilesystemsTable";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machinePartition as partitionFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FilesystemsTable", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
  });

  it("can show an empty message", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable canEditStorage filesystems={[]} systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("[data-test='no-filesystems']").text()).toBe(
      "No filesystems defined."
    );
  });

  it("can show filesystems associated with disks", () => {
    const store = mockStore(state);
    const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
    const disk = diskFactory({
      filesystem,
      name: "disk-fs",
      partitions: [],
    });
    const normalised = normaliseFilesystem(filesystem, disk);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable
          canEditStorage
          filesystems={[normalised]}
          systemId="abc123"
        />
      </Provider>
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe("disk-fs");
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/disk-fs/path"
    );
  });

  it("can show filesystems associated with partitions", () => {
    const store = mockStore(state);
    const filesystem = fsFactory({ mount_point: "/partition-fs/path" });
    const partition = partitionFactory({
      filesystem,
      name: "partition-fs",
    });
    const normalised = normaliseFilesystem(filesystem, partition);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable
          canEditStorage
          filesystems={[normalised]}
          systemId="abc123"
        />
      </Provider>
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe(
      "partition-fs"
    );
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/partition-fs/path"
    );
  });

  it("can show special filesystems", () => {
    const store = mockStore(state);
    const specialFilesystem = fsFactory({
      mount_point: "/special-fs/path",
      fstype: "tmpfs",
    });
    const filesystem = normaliseFilesystem(specialFilesystem);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable
          canEditStorage
          filesystems={[filesystem]}
          systemId="abc123"
        />
      </Provider>
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe("—");
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/special-fs/path"
    );
  });

  it("can show an add special filesystem form if storage can be edited", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable canEditStorage filesystems={[]} systemId="abc123" />
      </Provider>
    );

    wrapper.find("button[data-test='add-special-fs-button']").simulate("click");

    expect(wrapper.find("AddSpecialFilesystem").exists()).toBe(true);
  });

  it("can show an action to remove a filesystem", () => {
    const store = mockStore(state);
    const filesystem = fsFactory({ mount_point: "/disk-fs/path" });
    const disk = diskFactory({ filesystem });
    const normalised = normaliseFilesystem(filesystem, disk);
    const wrapper = mount(
      <Provider store={store}>
        <FilesystemsTable
          canEditStorage
          filesystems={[normalised]}
          systemId="abc123"
        />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");

    expect(wrapper.find("ContextualMenuDropdown Button").at(0).text()).toBe(
      "Remove filesystem..."
    );

    wrapper.find("ContextualMenuDropdown button").at(0).simulate("click");

    expect(wrapper.find("ActionConfirm").exists()).toBe(true);
  });
});
