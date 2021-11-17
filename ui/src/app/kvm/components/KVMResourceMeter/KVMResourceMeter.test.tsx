import { mount } from "enzyme";

import KVMResourceMeter from "./KVMResourceMeter";

describe("KVMResourceMeter", () => {
  it("can render a summary of the resource usage", () => {
    const wrapper = mount(<KVMResourceMeter allocated={1} free={2} />);
    expect(wrapper.find("[data-testid='kvm-resource-summary']").text()).toBe(
      "1 of 3 allocated"
    );
    expect(wrapper.find("[data-testid='kvm-resource-details']").exists()).toBe(
      false
    );
  });

  it("can rendered a detailed version of the resource usage", () => {
    const wrapper = mount(<KVMResourceMeter allocated={1} detailed free={2} />);
    expect(wrapper.find("[data-testid='kvm-resource-details']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-testid='kvm-resource-summary']").exists()).toBe(
      false
    );
  });

  it("renders other resource usage data if provided", () => {
    const wrapper = mount(
      <KVMResourceMeter allocated={1} detailed free={2} other={3} />
    );
    expect(wrapper.find("[data-testid='kvm-resource-other']").exists()).toBe(
      true
    );
  });

  it("does not render other resource usage data if not provided", () => {
    const wrapper = mount(<KVMResourceMeter allocated={1} detailed free={2} />);
    expect(wrapper.find("[data-testid='kvm-resource-other']").exists()).toBe(
      false
    );
  });

  it("correctly formats non-binary units", () => {
    const wrapper = mount(
      <KVMResourceMeter
        allocated={1000}
        detailed
        free={2000}
        other={4000}
        unit="B"
      />
    );
    expect(wrapper.find("[data-testid='kvm-resource-allocated']").text()).toBe(
      "1KB"
    );
    expect(wrapper.find("[data-testid='kvm-resource-free']").text()).toBe(
      "2KB"
    );
    expect(wrapper.find("[data-testid='kvm-resource-other']").text()).toBe(
      "4KB"
    );
  });

  it("correctly formats binary units", () => {
    const wrapper = mount(
      <KVMResourceMeter
        allocated={1024}
        binaryUnit
        detailed
        free={2048}
        other={4096}
        unit="B"
      />
    );
    expect(wrapper.find("[data-testid='kvm-resource-allocated']").text()).toBe(
      "1KiB"
    );
    expect(wrapper.find("[data-testid='kvm-resource-free']").text()).toBe(
      "2KiB"
    );
    expect(wrapper.find("[data-testid='kvm-resource-other']").text()).toBe(
      "4KiB"
    );
  });
});
