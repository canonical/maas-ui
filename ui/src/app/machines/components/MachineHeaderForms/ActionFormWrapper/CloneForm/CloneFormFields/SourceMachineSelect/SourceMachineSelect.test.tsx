import { mount } from "enzyme";

import SourceMachineSelect from "./SourceMachineSelect";

import type { Machine } from "app/store/machine/types";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
} from "testing/factories";

describe("SourceMachineSelect", () => {
  let machines: Machine[];

  beforeEach(() => {
    machines = [
      machineFactory({
        system_id: "abc123",
        hostname: "first",
        owner: "admin",
        tags: ["tag1"],
      }),
      machineFactory({
        system_id: "def456",
        hostname: "second",
        owner: "user",
        tags: ["tag2"],
      }),
    ];
  });

  it("shows a spinner while data is loading", () => {
    const wrapper = mount(
      <SourceMachineSelect
        loadingData
        machines={machines}
        onMachineClick={jest.fn()}
      />
    );

    expect(wrapper.find("[data-testid='loading-spinner']").exists()).toBe(true);
  });

  it("shows an error if no machines are available to select", () => {
    const wrapper = mount(
      <SourceMachineSelect
        machines={[machineFactory()]}
        onMachineClick={jest.fn()}
      />
    );
    expect(wrapper.find("[data-testid='no-source-machines']").exists()).toBe(
      false
    );

    wrapper.setProps({ machines: [] });
    expect(wrapper.find("[data-testid='no-source-machines']").exists()).toBe(
      true
    );
  });

  it("can filter machines by hostname, system_id and/or tags", () => {
    const wrapper = mount(
      <SourceMachineSelect machines={machines} onMachineClick={jest.fn()} />
    );

    // Filter by "first" which matches the hostname of the first machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "first" } });
    expect(wrapper.find("[data-testid='source-machine-first']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-testid='source-machine-second']").exists()).toBe(
      false
    );

    // Filter by "def" which matches the system_id of the second machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "def" } });
    expect(wrapper.find("[data-testid='source-machine-first']").exists()).toBe(
      false
    );
    expect(wrapper.find("[data-testid='source-machine-second']").exists()).toBe(
      true
    );

    // Filter by "tag" which matches the tags of the first and second machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "tag" } });
    expect(wrapper.find("[data-testid='source-machine-first']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-testid='source-machine-second']").exists()).toBe(
      true
    );
  });

  it("highlights the substring that matches the search text", () => {
    const wrapper = mount(
      <SourceMachineSelect machines={machines} onMachineClick={jest.fn()} />
    );

    // Filter by "fir" which matches part of the hostname of the first machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "fir" } });
    expect(
      wrapper
        .find("[data-testid='source-machine-first']")
        .render()
        .find("strong")
        .text()
    ).toBe("fir");
  });

  it("runs onMachineClick function on row click", () => {
    const onMachineClick = jest.fn();
    const wrapper = mount(
      <SourceMachineSelect
        machines={machines}
        onMachineClick={onMachineClick}
      />
    );

    wrapper.find("[data-testid='source-machine-row']").at(0).simulate("click");
    expect(onMachineClick).toHaveBeenCalledWith(machines[0]);
  });

  it("shows the machine's details when selected", () => {
    const selectedMachine = machineDetailsFactory();
    const wrapper = mount(
      <SourceMachineSelect
        machines={machines}
        onMachineClick={jest.fn()}
        selectedMachine={selectedMachine}
      />
    );

    expect(wrapper.find("SourceMachineDetails").exists()).toBe(true);
  });

  it("clears the selected machine on search input change", () => {
    const selectedMachine = machineDetailsFactory();
    const onMachineClick = jest.fn();
    const wrapper = mount(
      <SourceMachineSelect
        machines={machines}
        onMachineClick={onMachineClick}
        selectedMachine={selectedMachine}
      />
    );

    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "" } });
    expect(onMachineClick).toHaveBeenCalledWith(null);
  });
});
