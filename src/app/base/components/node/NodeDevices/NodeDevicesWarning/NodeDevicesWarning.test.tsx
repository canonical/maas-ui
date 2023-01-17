import { mount } from "enzyme";

import NodeDevicesWarning from "./NodeDevicesWarning";

import { MachineHeaderViews } from "app/machines/constants";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import { NodeActions, NodeStatusCode } from "app/store/types/node";
import {
  controllerDetails as controllerDetailsFactory,
  machineDetails as machineDetailsFactory,
  nodeDevice as nodeDeviceFactory,
} from "testing/factories";

describe("node is machine", () => {
  it(`prompts user to commission machine if no devices found and machine can be
    commissioned`, () => {
    const setSidePanelContent = jest.fn();
    const machine = machineDetailsFactory({
      actions: [NodeActions.COMMISSION],
    });
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={setSidePanelContent}
      />
    );

    expect(wrapper.find("[data-testid='no-devices-warning']").text()).toBe(
      "Try commissioning this machine to load PCI and USB device information."
    );

    wrapper.find("[data-testid='commission-machine'] button").simulate("click");

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: MachineHeaderViews.COMMISSION_MACHINE,
    });
  });

  it("shows a message if the machine has no node devices and is locked", () => {
    const machine = machineDetailsFactory({ locked: true });
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(wrapper.find("[data-testid='no-devices-warning']").text()).toBe(
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
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(wrapper.find("[data-testid='no-devices-warning']").text()).toBe(
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
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(wrapper.find("[data-testid='no-devices-warning']").text()).toBe(
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
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(wrapper.find("[data-testid='no-devices-warning']").text()).toBe(
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
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(wrapper.find("[data-testid='no-devices-warning']").text()).toBe(
      "Commissioning cannot be run at this time."
    );
  });

  it("shows a message if the machine has PCI devices but no USB devices", () => {
    const machine = machineDetailsFactory();
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.USB}
        node={machine}
        nodeDevices={[
          nodeDeviceFactory({ bus: NodeDeviceBus.PCIE, node_id: machine.id }),
        ]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(wrapper.find("[data-testid='no-usb-warning']").exists()).toBe(true);
  });
});

describe("node is controller", () => {
  it("only shows the header without additional commissioning information", () => {
    const controller = controllerDetailsFactory();
    const wrapper = mount(
      <NodeDevicesWarning
        bus={NodeDeviceBus.USB}
        node={controller}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(wrapper.find("[data-testid='no-devices-warning']").exists()).toBe(
      false
    );
  });
});
