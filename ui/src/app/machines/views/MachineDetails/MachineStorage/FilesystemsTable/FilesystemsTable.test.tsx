import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import { separateStorageData } from "../utils";

import FilesystemsTable from "./FilesystemsTable";

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
  it("can show an empty message", () => {
    const wrapper = mount(
      <FilesystemsTable canEditStorage={false} filesystems={[]} />
    );

    expect(wrapper.find("[data-test='no-filesystems']").text()).toBe(
      "No filesystems defined."
    );
  });

  it("can show filesystems associated with disks", () => {
    const disks = [
      diskFactory({
        filesystem: fsFactory({ mount_point: "/disk-fs/path" }),
        name: "disk-fs",
        partitions: [],
      }),
    ];
    const { filesystems } = separateStorageData(disks);
    const wrapper = mount(
      <FilesystemsTable canEditStorage={false} filesystems={filesystems} />
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe("disk-fs");
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/disk-fs/path"
    );
  });

  it("can show filesystems associated with partitions", () => {
    const disks = [
      diskFactory({
        filesystem: null,
        partitions: [
          partitionFactory({
            filesystem: fsFactory({ mount_point: "/partition-fs/path" }),
            name: "partition-fs",
          }),
        ],
      }),
    ];
    const { filesystems } = separateStorageData(disks);
    const wrapper = mount(
      <FilesystemsTable canEditStorage={false} filesystems={filesystems} />
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe(
      "partition-fs"
    );
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/partition-fs/path"
    );
  });

  it("can show special filesystems", () => {
    const specialFilesystems = [
      fsFactory({ mount_point: "/special-fs/path", fstype: "tmpfs" }),
    ];
    const { filesystems } = separateStorageData([], specialFilesystems);
    const wrapper = mount(
      <FilesystemsTable canEditStorage={false} filesystems={filesystems} />
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe("—");
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/special-fs/path"
    );
  });

  it("can show an add special filesystem form if storage can be edited", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/storage", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/storage"
            component={() => (
              <FilesystemsTable canEditStorage filesystems={[]} />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("button[data-test='add-special-fs-button']").simulate("click");

    expect(wrapper.find("AddSpecialFilesystem").exists()).toBe(true);
  });
});
