import { mount } from "enzyme";

import NumaNodes from "./NumaNodes";

import { nodeDisk as diskFactory } from "testing/factories";

describe("NumaNodes", () => {
  it("can show a single numa node", () => {
    const disk = diskFactory({
      numa_node: 5,
      numa_nodes: undefined,
    });
    const wrapper = mount(<NumaNodes disk={disk} />);

    expect(wrapper.find("[data-testid='numa-nodes']").text()).toBe("5");
  });

  it("can show multiple numa nodes with a warning", () => {
    const disk = diskFactory({
      numa_node: undefined,
      numa_nodes: [0, 1],
    });
    const wrapper = mount(<NumaNodes disk={disk} />);

    expect(wrapper.find("[data-testid='numa-nodes']").text()).toBe("0, 1");
    expect(
      wrapper
        .find("[role='tooltip']")
        .text()
        .match(/This volume is spread over multiple NUMA nodes/)
    ).toBeTruthy();
  });
});
