import { mount } from "enzyme";

import NodeDevicesWarning from "./NodeDevicesWarning";

import { NodeDeviceBus } from "app/store/nodedevice/types";
import { NodeActions, NodeStatusCode } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  nodeDevice as nodeDeviceFactory,
} from "testing/factories";

describe("NodeDevicesWarning", () => {
  it(`prompts user to commission machine if no devices found and machine can be
    commissioned`, () => {
    const setSelectedAction = jest.fn();
    const machine = machineDetailsFactory({
      actions: [NodeActions.COMMISSION],
    });
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        machine={machine}
        nodeDevices={[]}
        setSelectedAction={setSelectedAction}
      />
    );

    expect(wrapper.find("[data-test='no-devices']").text()).toBe(
      "Try commissioning this machine to load PCI and USB device information."
    );

    wrapper.find("[data-test='commission-machine'] button").simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith({
      name: NodeActions.COMMISSION,
    });
  });

  it("shows a message if the machine has no node devices and is locked", () => {
    const machine = machineDetailsFactory({ locked: true });
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        machine={machine}
        nodeDevices={[]}
        setSelectedAction={jest.fn()}
      />
    );

    expect(wrapper.find("[data-test='no-devices']").text()).toBe(
      "The machine is locked. Unlock and release this machine before commissioning to load PCI and USB device information."
    );
  });

  it("shows a message if the machine has no node devices and is in failed testing state", () => {
    const machine = machineDetailsFactory({
      status_code: NodeStatusCode.FAILED_TESTING,
    });
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        machine={machine}
        nodeDevices={[]}
        setSelectedAction={jest.fn()}
      />
    );

    expect(wrapper.find("[data-test='no-devices']").text()).toBe(
      "Override failed testing before commissioning to load PCI and USB device information."
    );
  });

  it("shows a message if the machine has no node devices and is deployed", () => {
    const machine = machineDetailsFactory({
      status_code: NodeStatusCode.DEPLOYED,
    });
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        machine={machine}
        nodeDevices={[]}
        setSelectedAction={jest.fn()}
      />
    );

    expect(wrapper.find("[data-test='no-devices']").text()).toBe(
      "Release this machine before commissioning to load PCI and USB device information."
    );
  });

  it("shows a message if the machine has no node devices and is commissioning", () => {
    const machine = machineDetailsFactory({
      locked: false,
      status_code: NodeStatusCode.COMMISSIONING,
    });
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        machine={machine}
        nodeDevices={[]}
        setSelectedAction={jest.fn()}
      />
    );

    expect(wrapper.find("[data-test='no-devices']").text()).toBe(
      "Commissioning is currently in progress..."
    );
  });

  it("shows a generic message if the machine has no node devices and cannot be commissioned", () => {
    const machine = machineDetailsFactory({
      actions: [],
      locked: false,
      status_code: NodeStatusCode.NEW,
    });
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        machine={machine}
        nodeDevices={[]}
        setSelectedAction={jest.fn()}
      />
    );

    expect(wrapper.find("[data-test='no-devices']").text()).toBe(
      "Commissioning cannot be run at this time."
    );
  });

  it("shows a message if the machine has PCI devices but no USB devices", () => {
    const machine = machineDetailsFactory();
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.USB}
        machine={machine}
        nodeDevices={[
          nodeDeviceFactory({ bus: NodeDeviceBus.PCIE, node_id: machine.id }),
        ]}
        setSelectedAction={jest.fn()}
      />
    );

    expect(wrapper.find("[data-test='no-usb']").exists()).toBe(true);
  });
});
