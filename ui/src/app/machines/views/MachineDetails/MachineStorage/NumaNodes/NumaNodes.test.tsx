import React from "react";

import { mount } from "enzyme";

import { normaliseStorageDevice } from "../utils";

import NumaNodes from "./NumaNodes";

import { machineDisk as diskFactory } from "testing/factories";

describe("NumaNodes", () => {
  it("can show a single numa node", () => {
    const disk = diskFactory({ is_boot: true, numa_node: 5, type: "physical" });
    const normalised = normaliseStorageDevice(disk);
    const wrapper = mount(<NumaNodes numaNodes={normalised.numaNodes} />);

    expect(wrapper.find("[data-test='numa-nodes']").text()).toBe("5");
  });

  it("can show multiple numa nodes with a warning", () => {
    const disk = diskFactory({
      numa_node: undefined,
      numa_nodes: [0, 1],
      type: "lvm-vg",
    });
    const normalised = normaliseStorageDevice(disk);
    const wrapper = mount(<NumaNodes numaNodes={normalised.numaNodes} />);

    expect(wrapper.find("[data-test='numa-nodes']").text()).toBe("0, 1");
    expect(wrapper.find("[data-test='numa-warning']").prop("message")).toBe(
      "This volume is spread over multiple NUMA nodes which may cause suboptimal performance."
    );
  });
});
