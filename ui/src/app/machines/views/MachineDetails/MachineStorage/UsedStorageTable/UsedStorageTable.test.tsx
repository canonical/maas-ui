import { mount } from "enzyme";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import { machineDisk as diskFactory } from "testing/factories";
import { separateStorageData } from "../utils";
import UsedStorageTable from "./UsedStorageTable";

describe("UsedStorageTable", () => {
  it("can show an empty message", () => {
    const wrapper = mount(<UsedStorageTable storageDevices={[]} />);

    expect(wrapper.find("[data-test='no-used']").text()).toBe(
      "No disk or partition has been fully utilised."
    );
  });

  it("shows a warning if volume is spread over multiple NUMA nodes", () => {
    const disks = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE - 1,
        numa_node: undefined,
        numa_nodes: [0, 1],
        type: "lvm-vg",
      }),
    ];
    const { used } = separateStorageData(disks);
    const wrapper = mount(<UsedStorageTable storageDevices={used} />);

    expect(wrapper.find("[data-test='numa-warning']").prop("message")).toBe(
      "This volume is spread over multiple NUMA nodes which may cause suboptimal performance."
    );
  });

  it("can show links to filter machine list by storage tag", () => {
    const disks = [
      diskFactory({ available_size: MIN_PARTITION_SIZE - 1, tags: ["tag-1"] }),
    ];
    const { used } = separateStorageData(disks);
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <UsedStorageTable storageDevices={used} />
      </MemoryRouter>
    );

    expect(wrapper.find("[data-test='health'] Link").exists()).toBe(true);
    expect(wrapper.find("[data-test='health'] Link").prop("to")).toBe(
      "/machines?storage_tags=%3Dtag-1"
    );
  });

  it("can show what the disk is being used for", () => {
    const disks = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE - 1,
        used_for: "nefarious purposes",
      }),
    ];
    const { used } = separateStorageData(disks);
    const wrapper = mount(<UsedStorageTable storageDevices={used} />);

    expect(wrapper.find("[data-test='used-for']").text()).toBe(
      "nefarious purposes"
    );
  });
});
