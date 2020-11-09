import { mount } from "enzyme";
import React from "react";

import {
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machinePartition as partitionFactory,
} from "testing/factories";
import FilesystemsTable from "./FilesystemsTable";

describe("FilesystemsTable", () => {
  it("can show an empty message", () => {
    const wrapper = mount(
      <FilesystemsTable disks={[]} specialFilesystems={[]} />
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe(
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
    const wrapper = mount(
      <FilesystemsTable disks={disks} specialFilesystems={[]} />
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
    const wrapper = mount(
      <FilesystemsTable disks={disks} specialFilesystems={[]} />
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
    const wrapper = mount(
      <FilesystemsTable disks={[]} specialFilesystems={specialFilesystems} />
    );

    expect(wrapper.find("TableRow TableCell").at(0).text()).toBe("—");
    expect(wrapper.find("TableRow TableCell").at(3).text()).toBe(
      "/special-fs/path"
    );
  });
});
