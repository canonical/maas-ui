import { mount } from "enzyme";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import {
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machinePartition as partitionFactory,
} from "testing/factories";
import { separateStorageData } from "../utils";
import AvailableStorageTable from "./AvailableStorageTable";

describe("AvailableStorageTable", () => {
  it("can show an empty message", () => {
    const wrapper = mount(<AvailableStorageTable storageDevices={[]} />);

    expect(wrapper.find("[data-test='no-available']").text()).toBe(
      "No available disks or partitions."
    );
  });

  it("shows boot status for physical disks", () => {
    const disks = [diskFactory({ is_boot: true, type: "physical" })];
    const { available } = separateStorageData(disks);
    const wrapper = mount(<AvailableStorageTable storageDevices={available} />);

    expect(wrapper.find("[data-test='boot'] .p-icon--tick").exists()).toBe(
      true
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

  it("shows a warning if volume is spread over multiple NUMA nodes", () => {
    const disks = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        numa_node: undefined,
        numa_nodes: [0, 1],
        type: "lvm-vg",
      }),
    ];
    const { available } = separateStorageData(disks);
    const wrapper = mount(<AvailableStorageTable storageDevices={available} />);

    expect(wrapper.find("[data-test='numa-warning']").prop("message")).toBe(
      "This volume is spread over multiple NUMA nodes which may cause suboptimal performance."
    );
  });

  it("can show links to filter machine list by storage tag", () => {
    const disks = [
      diskFactory({ available_size: MIN_PARTITION_SIZE + 1, tags: ["tag-1"] }),
    ];
    const { available } = separateStorageData(disks);
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <AvailableStorageTable storageDevices={available} />
      </MemoryRouter>
    );

    expect(wrapper.find("[data-test='health'] Link").exists()).toBe(true);
    expect(wrapper.find("[data-test='health'] Link").prop("to")).toBe(
      "/machines?storage_tags=%3Dtag-1"
    );
  });
});
