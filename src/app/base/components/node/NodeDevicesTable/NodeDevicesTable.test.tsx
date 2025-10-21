import configureStore from "redux-mock-store";

import NodeDevicesTable from "./NodeDevicesTable";

import { HardwareType } from "@/app/base/enum";
import urls from "@/app/base/urls";
import { nodeDeviceActions } from "@/app/store/nodedevice";
import { NodeDeviceBus } from "@/app/store/nodedevice/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  renderWithMockStore,
  screen,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("NodeDevicesTable", () => {
  it("fetches node devices by node id if not already loaded", () => {
    const machine = factory.machineDetails();
    const state = factory.rootState({
      nodedevice: factory.nodeDeviceState({
        items: [],
      }),
    });
    const store = mockStore(state);
    renderWithMockStore(
      <NodeDevicesTable
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={vi.fn()}
      />,
      { store }
    );

    const expectedAction = nodeDeviceActions.getByNodeId(machine.system_id);
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("does not fetch node devices if already loaded", () => {
    const machine = factory.machineDetails();
    const state = factory.rootState({
      nodedevice: factory.nodeDeviceState({
        items: [factory.nodeDevice({ node_id: machine.id })],
      }),
    });
    const store = mockStore(state);
    renderWithMockStore(
      <NodeDevicesTable
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={vi.fn()}
      />,
      { store }
    );

    const expectedAction = nodeDeviceActions.getByNodeId(machine.system_id);
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toEqual(undefined);
  });

  it("shows placeholder rows while node devices are loading", () => {
    const machine = factory.machineDetails();
    const state = factory.rootState({
      nodedevice: factory.nodeDeviceState({
        loading: true,
      }),
    });
    renderWithMockStore(
      <NodeDevicesTable
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={vi.fn()}
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
    const machine = factory.machineDetails();
    const state = factory.rootState();
    renderWithMockStore(
      <NodeDevicesTable
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );

    expect(screen.getByTestId("pci-address-col")).toBeInTheDocument();
  });

  it("shows bus and device address columns if showing USB devices", () => {
    const machine = factory.machineDetails();
    const state = factory.rootState();
    renderWithMockStore(
      <NodeDevicesTable
        bus={NodeDeviceBus.USB}
        node={machine}
        setSidePanelContent={vi.fn()}
      />,
      { state }
    );

    expect(screen.getByTestId("bus-address-col")).toBeInTheDocument();
    expect(screen.getByTestId("device-address-col")).toBeInTheDocument();
  });

  it("groups node devices by hardware type", () => {
    const machine = factory.machineDetails({ system_id: "abc123" });
    const networkDevices = [
      factory.nodeDevice({
        bus: NodeDeviceBus.PCIE,
        hardware_type: HardwareType.Network,
        node_id: machine.id,
      }),
    ];
    const storageDevices = Array.from(Array(3)).map(() =>
      factory.nodeDevice({
        bus: NodeDeviceBus.PCIE,
        hardware_type: HardwareType.Storage,
        node_id: machine.id,
      })
    );
    const state = factory.rootState({
      nodedevice: factory.nodeDeviceState({
        items: [...networkDevices, ...storageDevices],
      }),
    });
    renderWithBrowserRouter(
      <NodeDevicesTable
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={vi.fn()}
      />,
      { route: "/machine/abc123/pci-devices", state }
    );

    expect(screen.getByText("Network")).toBeInTheDocument();
    expect(screen.getByText("1 device")).toBeInTheDocument();

    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("3 devices")).toBeInTheDocument();
  });

  it("can link to the machine network and storage tabs", () => {
    const machine = factory.machineDetails({ system_id: "abc123" });
    const networkDevice = factory.nodeDevice({
      bus: NodeDeviceBus.PCIE,
      hardware_type: HardwareType.Network,
      node_id: machine.id,
    });
    const storageDevice = factory.nodeDevice({
      bus: NodeDeviceBus.PCIE,
      hardware_type: HardwareType.Storage,
      node_id: machine.id,
    });
    const state = factory.rootState({
      nodedevice: factory.nodeDeviceState({
        items: [networkDevice, storageDevice],
      }),
    });
    renderWithBrowserRouter(
      <NodeDevicesTable
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={vi.fn()}
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
    const controller = factory.controllerDetails({ system_id: "abc123" });
    const networkDevice = factory.nodeDevice({
      bus: NodeDeviceBus.PCIE,
      hardware_type: HardwareType.Network,
      node_id: controller.id,
    });
    const storageDevice = factory.nodeDevice({
      bus: NodeDeviceBus.PCIE,
      hardware_type: HardwareType.Storage,
      node_id: controller.id,
    });
    const state = factory.rootState({
      nodedevice: factory.nodeDeviceState({
        items: [networkDevice, storageDevice],
      }),
    });
    renderWithBrowserRouter(
      <NodeDevicesTable bus={NodeDeviceBus.PCIE} node={controller} />,
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
    const numaNode = factory.machineNumaNode({ index: 128 });
    const machine = factory.machineDetails({
      numa_nodes: [numaNode, factory.machineNumaNode()],
      system_id: "abc123",
    });
    const pciDevice = factory.nodeDevice({
      bus: NodeDeviceBus.PCIE,
      id: 1,
      node_id: machine.id,
      numa_node_id: numaNode.id,
    });
    const state = factory.rootState({
      nodedevice: factory.nodeDeviceState({
        items: [pciDevice],
      }),
    });
    renderWithBrowserRouter(
      <NodeDevicesTable
        bus={NodeDeviceBus.PCIE}
        node={machine}
        setSidePanelContent={vi.fn()}
      />,
      { route: "/machine/abc123/pci-devices", state }
    );

    expect(screen.getByTestId("node-device-1-numa")).toHaveTextContent("128");
  });
});
