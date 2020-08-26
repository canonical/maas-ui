import { shallow } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";

import KVMNumaResources, { TRUNCATION_POINT } from "./KVMNumaResources";
import { fakeNumas } from "../KVMSummary";

describe("KVMNumaResources", () => {
  it("can expand truncated NUMA nodes if above truncation point", () => {
    const numaNodes = [...fakeNumas, ...fakeNumas];
    const wrapper = shallow(<KVMNumaResources numaNodes={numaNodes} />);

    expect(wrapper.find("Button[data-test='show-more-numas']").exists()).toBe(
      true
    );
    expect(wrapper.find("KVMResourcesCard").length).toBe(TRUNCATION_POINT);

    act(() => {
      wrapper.find("Button[data-test='show-more-numas']").simulate("click");
    });
    wrapper.update();

    expect(
      wrapper.find("Button[data-test='show-more-numas'] span").text()
    ).toBe("Show less NUMA nodes");
    expect(wrapper.find("KVMResourcesCard").length).toBe(numaNodes.length);
  });

  it("shows wide cards if the pod has less than or equal to 2 NUMA nodes", () => {
    const numaNodes = [fakeNumas[0]];
    const wrapper = shallow(<KVMNumaResources numaNodes={numaNodes} />);

    expect(wrapper.find(".numa-resources-grid.is-wide").exists()).toBe(true);
    expect(wrapper.find("KVMResourcesCard").length).toBe(1);
    expect(
      wrapper
        .find("KVMResourcesCard")
        .prop("className")
        .includes("kvm-resources-card--wide")
    ).toBe(true);
  });
});
