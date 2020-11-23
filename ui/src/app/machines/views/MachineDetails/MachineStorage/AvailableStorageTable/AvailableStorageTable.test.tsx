import React from "react";

import { mount } from "enzyme";

import { separateStorageData } from "../utils";

import AvailableStorageTable from "./AvailableStorageTable";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import {
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machinePartition as partitionFactory,
} from "testing/factories";

describe("AvailableStorageTable", () => {
  it("can show an empty message", () => {
    const wrapper = mount(<AvailableStorageTable storageDevices={[]} />);

    expect(wrapper.find("[data-test='no-available']").text()).toBe(
      "No available disks or partitions."
    );
  });

  it("correctly shows type of physical disks", () => {
    const disks = [diskFactory({ type: "physical" })];
    const { available } = separateStorageData(disks);
    const wrapper = mount(<AvailableStorageTable storageDevices={available} />);

    expect(wrapper.find("[data-test='type']").at(0).prop("primary")).toBe(
      "Physical"
    );
  });

  it("correctly shows type of partitions", () => {
    const disks = [
      diskFactory({
        available_size: 0,
        partitions: [
          partitionFactory({
            filesystem: fsFactory({ mount_point: "" }),
            type: "partition",
          }),
        ],
      }),
    ];
    const { available } = separateStorageData(disks);
    const wrapper = mount(<AvailableStorageTable storageDevices={available} />);

    expect(wrapper.find("[data-test='type']").at(0).prop("primary")).toBe(
      "Partition"
    );
  });

  it("correctly shows type of volume groups", () => {
    const disks = [
      diskFactory({ available_size: MIN_PARTITION_SIZE + 1, type: "lvm-vg" }),
    ];
    const { available } = separateStorageData(disks);
    const wrapper = mount(<AvailableStorageTable storageDevices={available} />);

    expect(wrapper.find("[data-test='type']").at(0).prop("primary")).toBe(
      "Volume group"
    );
  });

  it("correctly shows type of logical volumes", () => {
    const [parent, child] = [
      diskFactory({ available_size: 0, id: 1, type: "lvm-vg" }),
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        parent: { id: 1, type: "lvm-vg", uuid: "abc" },
        type: "virtual",
      }),
    ];
    const { available } = separateStorageData([parent, child]);
    const wrapper = mount(<AvailableStorageTable storageDevices={available} />);

    expect(wrapper.find("[data-test='type']").at(0).prop("primary")).toBe(
      "Logical volume"
    );
  });

  it("correctly shows type of RAIDs", () => {
    const [parent, child] = [
      diskFactory({ available_size: 0, id: 1, type: "raid-0" }),
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        parent: { id: 1, type: "raid-0", uuid: "abc" },
        type: "virtual",
      }),
    ];
    const { available } = separateStorageData([parent, child]);
    const wrapper = mount(<AvailableStorageTable storageDevices={available} />);

    expect(wrapper.find("[data-test='type']").at(0).prop("primary")).toBe(
      "RAID 0"
    );
  });
});
