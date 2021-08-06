import { mount } from "enzyme";

import SourceMachineDetails from "./SourceMachineDetails";

import { NodeStatus } from "app/store/types/node";
import { machineDetails as machineDetailsFactory } from "testing/factories";

describe("SourceMachineDetails", () => {
  it("renders a list of the source machine's details", () => {
    const machine = machineDetailsFactory({
      architecture: "",
      cpu_count: 2,
      cpu_speed: 2000,
      domain: { id: 1, name: "domain" },
      metadata: { cpu_model: "CPU model" },
      memory: 8,
      owner: "Owner",
      physical_disk_count: 2,
      pod: { id: 2, name: "pod" },
      power_type: "manual",
      status: NodeStatus.READY,
      storage: 8,
      zone: { id: 3, name: "zone" },
    });
    const wrapper = mount(<SourceMachineDetails machine={machine} />);
    expect(
      wrapper.find("[data-test='source-machine-details']")
    ).toMatchSnapshot();
  });

  it("shows a placeholder list if machine not provided", () => {
    const wrapper = mount(<SourceMachineDetails machine={null} />);
    expect(wrapper.find("[data-test='placeholder-list']").exists()).toBe(true);
    expect(wrapper.find("[data-test='source-machine-details']").exists()).toBe(
      false
    );
  });
});
