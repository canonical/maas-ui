import { mount } from "enzyme";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import {
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machinePartition as partitionFactory,
} from "testing/factories";
import { MIN_PARTITION_SIZE } from "../MachineStorage";
import AvailableStorageTable from "./AvailableStorageTable";

describe("AvailableStorageTable", () => {
  it("can show an empty message", () => {
    const wrapper = mount(<AvailableStorageTable disks={[]} />);

    expect(wrapper.find("[data-test='no-available']").text()).toBe(
      "No available disks or partitions."
    );
  });

  it("correctly filters available disks", () => {
    const [availableDisk, unavailableDisk] = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        name: "available-disk",
      }),
      diskFactory({ available_size: 0, name: "unavailable-disk" }),
    ];
    const wrapper = mount(
      <AvailableStorageTable disks={[availableDisk, unavailableDisk]} />
    );

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("tbody TableRow DoubleRow").at(0).prop("primary")).toBe(
      "available-disk"
    );
  });

  it("correctly filters available partitions", () => {
    const [availablePartition, unavailablePartition] = [
      partitionFactory({
        filesystem: fsFactory({ mount_point: "" }),
        name: "available-partition",
      }),
      partitionFactory({
        filesystem: fsFactory({ mount_point: "/path" }),
        name: "unavailable-partition",
      }),
    ];
    const disk = diskFactory({
      available_size: 0,
      partitions: [availablePartition, unavailablePartition],
    });
    const wrapper = mount(<AvailableStorageTable disks={[disk]} />);

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("[data-test='name']").at(0).prop("primary")).toBe(
      "available-partition"
    );
  });

  it("shows boot status for physical disks", () => {
    const disks = [diskFactory({ is_boot: true, type: "physical" })];
    const wrapper = mount(<AvailableStorageTable disks={disks} />);

    expect(wrapper.find("[data-test='boot'] .p-icon--tick").exists()).toBe(
      true
    );
  });

  it("correctly shows type of physical disks", () => {
    const disks = [diskFactory({ type: "physical" })];
    const wrapper = mount(<AvailableStorageTable disks={disks} />);

    expect(wrapper.find("[data-test='type']").at(0).prop("primary")).toBe(
      "Physical"
    );
  });

  it("correctly shows type of partitions", () => {
    const disk = diskFactory({
      available_size: 0,
      partitions: [
        partitionFactory({
          filesystem: fsFactory({ mount_point: "" }),
          type: "partition",
        }),
      ],
    });
    const wrapper = mount(<AvailableStorageTable disks={[disk]} />);

    expect(wrapper.find("[data-test='type']").at(0).prop("primary")).toBe(
      "Partition"
    );
  });

  it("correctly shows type of volume groups", () => {
    const disks = [
      diskFactory({ available_size: MIN_PARTITION_SIZE + 1, type: "lvm-vg" }),
    ];
    const wrapper = mount(<AvailableStorageTable disks={disks} />);

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
    const wrapper = mount(<AvailableStorageTable disks={[parent, child]} />);

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
    const wrapper = mount(<AvailableStorageTable disks={[parent, child]} />);

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
    const wrapper = mount(<AvailableStorageTable disks={disks} />);

    expect(wrapper.find("[data-test='numa-warning']").prop("message")).toBe(
      "This volume is spread over multiple NUMA nodes which may cause suboptimal performance."
    );
  });

  it("can show links to filter machine list by storage tag", () => {
    const disks = [
      diskFactory({ available_size: MIN_PARTITION_SIZE + 1, tags: ["tag-1"] }),
    ];
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <AvailableStorageTable disks={disks} />
      </MemoryRouter>
    );

    expect(wrapper.find("[data-test='health'] Link").exists()).toBe(true);
    expect(wrapper.find("[data-test='health'] Link").prop("to")).toBe(
      "/machines?storage_tags=%3Dtag-1"
    );
  });
});
