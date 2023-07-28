import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NodeDevicesWarning from "./NodeDevicesWarning";

import { MachineSidePanelViews } from "app/machines/constants";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import { NodeActions, NodeStatusCode } from "app/store/types/node";
import {
  controllerDetails as controllerDetailsFactory,
  machineDetails as machineDetailsFactory,
  nodeDevice as nodeDeviceFactory,
} from "testing/factories";

describe("node is machine", () => {
  it(`prompts user to commission machine if no devices found and machine can be
    commissioned`, async () => {
    const setSidePanelContent = jest.fn();
    const machine = machineDetailsFactory({
      actions: [NodeActions.COMMISSION],
    });

    render(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={setSidePanelContent}
      />
    );

    expect(
      screen.getByText(/Try commissioning this machine/i)
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("commission-machine"));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: MachineSidePanelViews.COMMISSION_MACHINE,
    });
  });

  it("shows a message if the machine has no node devices and is locked", () => {
    const machine = machineDetailsFactory({ locked: true });

    render(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(screen.getByText(/The machine is locked/i)).toBeInTheDocument();
  });

  it("shows a message if the machine has no node devices and is in failed testing state", () => {
    const machine = machineDetailsFactory({
      status_code: NodeStatusCode.FAILED_TESTING,
    });

    render(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(screen.getByText(/Override failed testing/i)).toBeInTheDocument();
  });

  it("shows a message if the machine has no node devices and is deployed", () => {
    const machine = machineDetailsFactory({
      status_code: NodeStatusCode.DEPLOYED,
    });

    render(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(screen.getByText(/Release this machine/i)).toBeInTheDocument();
  });

  it("shows a message if the machine has no node devices and is commissioning", () => {
    const machine = machineDetailsFactory({
      locked: false,
      status_code: NodeStatusCode.COMMISSIONING,
    });

    render(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(
      screen.getByText(/Commissioning is currently in progress/i)
    ).toBeInTheDocument();
  });

  it("shows a generic message if the machine has no node devices and cannot be commissioned", () => {
    const machine = machineDetailsFactory({
      actions: [],
      locked: false,
      status_code: NodeStatusCode.NEW,
    });

    render(
      <NodeDevicesWarning
        bus={NodeDeviceBus.PCIE}
        node={machine}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(
      screen.getByText(/Commissioning cannot be run at this time/i)
    ).toBeInTheDocument();
  });

  it("shows a message if the machine has PCI devices but no USB devices", () => {
    const machine = machineDetailsFactory();

    render(
      <NodeDevicesWarning
        bus={NodeDeviceBus.USB}
        node={machine}
        nodeDevices={[
          nodeDeviceFactory({ bus: NodeDeviceBus.PCIE, node_id: machine.id }),
        ]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(screen.getByTestId("no-usb-warning")).toBeInTheDocument();
  });
});

describe("node is controller", () => {
  it("only shows the header without additional commissioning information", () => {
    const controller = controllerDetailsFactory();

    render(
      <NodeDevicesWarning
        bus={NodeDeviceBus.USB}
        node={controller}
        nodeDevices={[]}
        setSidePanelContent={jest.fn()}
      />
    );

    expect(screen.queryByTestId("no-devices-warning")).toBeNull();
  });
});
