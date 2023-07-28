import configureStore from "redux-mock-store";

import NodeDevices from "./NodeDevices";

import { HardwareType } from "app/base/enum";
import urls from "app/base/urls";
import { actions as nodeDeviceActions } from "app/store/nodedevice";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { RootState } from "app/store/root/types";
import {
  controllerDetails as controllerDetailsFactory,
  machineDetails as machineDetailsFactory,
  machineNumaNode as numaNodeFactory,
  nodeDevice as nodeDeviceFactory,
  nodeDeviceState as nodeDeviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  renderWithMockStore,
  screen,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("NodeDevices", () => {
  it("fetches node devices by node id if not already loaded", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    renderWithMockStore(
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={jest.fn()}
      />,
      { store }
    );

    const expectedAction = nodeDeviceActions.getByNodeId(machine.system_id);
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("does not fetch node devices if already loaded", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [nodeDeviceFactory({ node_id: machine.id })],
      }),
    });
    const store = mockStore(state);
    renderWithMockStore(
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={jest.fn()}
      />,
      { store }
    );

    const expectedAction = nodeDeviceActions.getByNodeId(machine.system_id);
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toEqual(undefined);
  });

  it("shows placeholder rows while node devices are loading", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        loading: true,
      }),
    });
    renderWithMockStore(
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={jest.fn()}
      />,
      { state }
    );
    expect(screen.getAllByText("Group name")).toHaveLength(5);
    expect(screen.getAllByText("X devices")).toHaveLength(5);
    expect(screen.getAllByText("Example vendor")).toHaveLength(5);
    expect(screen.getAllByText("0000")).toHaveLength(15);
    expect(screen.getAllByText("Example product description")).toHaveLength(5);
    expect(screen.getAllByText("0000:00:00.0")).toHaveLength(5);
  });

  it("shows a PCI address column if showing PCI devices", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory();
    renderWithMockStore(
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={jest.fn()}
      />,
      { state }
    );

    expect(screen.getByTestId("pci-address-col")).toBeInTheDocument();
  });

  it("shows bus and device address columns if showing USB devices", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory();
    renderWithMockStore(
      <NodeDevices
        bus={NodeDeviceBus.USB}
        node={machine}
        setSidePanelContent={jest.fn()}
      />,
      { state }
    );

    expect(screen.getByTestId("bus-address-col")).toBeInTheDocument();
    expect(screen.getByTestId("device-address-col")).toBeInTheDocument();
  });

  it("groups node devices by hardware type", () => {
    const machine = machineDetailsFactory({ system_id: "abc123" });
    const networkDevices = [
      nodeDeviceFactory({
        bus: NodeDeviceBus.PCIE,
        hardware_type: HardwareType.Network,
        node_id: machine.id,
      }),
    ];
    const storageDevices = Array.from(Array(3)).map(() =>
      nodeDeviceFactory({
        bus: NodeDeviceBus.PCIE,
        hardware_type: HardwareType.Storage,
        node_id: machine.id,
      })
    );
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [...networkDevices, ...storageDevices],
      }),
    });
    renderWithBrowserRouter(
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/machine/abc123/pci-devices", state }
    );

    expect(screen.getByText("Network")).toBeInTheDocument();
    expect(screen.getByText("1 device")).toBeInTheDocument();

    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("3 devices")).toBeInTheDocument();
  });

  it("can link to the machine network and storage tabs", () => {
    const machine = machineDetailsFactory({ system_id: "abc123" });
    const networkDevice = nodeDeviceFactory({
      bus: NodeDeviceBus.PCIE,
      hardware_type: HardwareType.Network,
      node_id: machine.id,
    });
    const storageDevice = nodeDeviceFactory({
      bus: NodeDeviceBus.PCIE,
      hardware_type: HardwareType.Storage,
      node_id: machine.id,
    });
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [networkDevice, storageDevice],
      }),
    });
    renderWithBrowserRouter(
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/machine/abc123/pci-devices", state }
    );

    expect(screen.getByRole("link", { name: "Network" })).toHaveAttribute(
      "href",
      urls.machines.machine.network({ id: machine.system_id })
    );
    expect(screen.getByRole("link", { name: "Storage" })).toHaveAttribute(
      "href",
      urls.machines.machine.storage({ id: machine.system_id })
    );
  });

  it("can link to the controller network and storage tabs", () => {
    const controller = controllerDetailsFactory({ system_id: "abc123" });
    const networkDevice = nodeDeviceFactory({
      bus: NodeDeviceBus.PCIE,
      hardware_type: HardwareType.Network,
      node_id: controller.id,
    });
    const storageDevice = nodeDeviceFactory({
      bus: NodeDeviceBus.PCIE,
      hardware_type: HardwareType.Storage,
      node_id: controller.id,
    });
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [networkDevice, storageDevice],
      }),
    });
    renderWithBrowserRouter(
      <NodeDevices bus={NodeDeviceBus.PCIE} node={controller} />,
      { route: "/controller/abc123/pci-devices", state }
    );

    expect(screen.getByRole("link", { name: "Network" })).toHaveAttribute(
      "href",
      urls.controllers.controller.network({ id: controller.system_id })
    );
    expect(screen.getByRole("link", { name: "Storage" })).toHaveAttribute(
      "href",
      urls.controllers.controller.storage({ id: controller.system_id })
    );
  });

  it("displays the NUMA node index of a node device", () => {
    const numaNode = numaNodeFactory({ index: 128 });
    const machine = machineDetailsFactory({
      numa_nodes: [numaNode, numaNodeFactory()],
      system_id: "abc123",
    });
    const pciDevice = nodeDeviceFactory({
      bus: NodeDeviceBus.PCIE,
      id: 1,
      node_id: machine.id,
      numa_node_id: numaNode.id,
    });
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [pciDevice],
      }),
    });
    renderWithBrowserRouter(
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/machine/abc123/pci-devices", state }
    );

    expect(screen.getByTestId("node-device-1-numa")).toHaveTextContent("128");
  });
});
