import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import NodeDevices from "./NodeDevices";

import { HardwareType } from "app/base/enum";
import urls from "app/base/urls";
import { actions as nodeDeviceActions } from "app/store/nodedevice";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import {
  controllerDetails as controllerDetailsFactory,
  machineDetails as machineDetailsFactory,
  machineNumaNode as numaNodeFactory,
  nodeDevice as nodeDeviceFactory,
  nodeDeviceState as nodeDeviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NodeDevices", () => {
  it("fetches node devices by node id if not already loaded", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <NodeDevices
          bus={NodeDeviceBus.PCIE}
          node={machine}
          setHeaderContent={jest.fn()}
        />
      </Provider>
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
    mount(
      <Provider store={store}>
        <NodeDevices
          bus={NodeDeviceBus.PCIE}
          node={machine}
          setHeaderContent={jest.fn()}
        />
      </Provider>
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NodeDevices
          bus={NodeDeviceBus.PCIE}
          node={machine}
          setHeaderContent={jest.fn()}
        />
      </Provider>
    );

    expect(wrapper.find("Placeholder").exists()).toBe(true);
  });

  it("shows a PCI address column if showing PCI devices", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NodeDevices
          bus={NodeDeviceBus.PCIE}
          node={machine}
          setHeaderContent={jest.fn()}
        />
      </Provider>
    );

    expect(wrapper.find("[data-testid='pci-address-col']").exists()).toBe(true);
  });

  it("shows bus and device address columns if showing USB devices", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NodeDevices
          bus={NodeDeviceBus.USB}
          node={machine}
          setHeaderContent={jest.fn()}
        />
      </Provider>
    );

    expect(wrapper.find("[data-testid='bus-address-col']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='device-address-col']").exists()).toBe(
      true
    );
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/pci-devices", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <NodeDevices
              bus={NodeDeviceBus.PCIE}
              node={machine}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .find("[data-testid='group-label']")
        .at(0)
        .find(".p-double-row__primary-row")
        .text()
    ).toBe("Network");
    expect(
      wrapper
        .find("[data-testid='group-label']")
        .at(0)
        .find(".p-double-row__secondary-row")
        .text()
    ).toBe("1 device");
    expect(
      wrapper
        .find("[data-testid='group-label']")
        .at(1)
        .find(".p-double-row__primary-row")
        .text()
    ).toBe("Storage");
    expect(
      wrapper
        .find("[data-testid='group-label']")
        .at(1)
        .find(".p-double-row__secondary-row")
        .text()
    ).toBe("3 devices");
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/pci-devices", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <NodeDevices
              bus={NodeDeviceBus.PCIE}
              node={machine}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='group-label']").at(0).find("Link").prop("to")
    ).toBe(urls.machines.machine.network({ id: machine.system_id }));
    expect(
      wrapper.find("[data-testid='group-label']").at(1).find("Link").prop("to")
    ).toBe(urls.machines.machine.storage({ id: machine.system_id }));
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/controller/abc123/pci-devices", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <NodeDevices bus={NodeDeviceBus.PCIE} node={controller} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='group-label']").at(0).find("Link").prop("to")
    ).toBe(urls.controllers.controller.network({ id: controller.system_id }));
    expect(
      wrapper.find("[data-testid='group-label']").at(1).find("Link").prop("to")
    ).toBe(urls.controllers.controller.storage({ id: controller.system_id }));
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/pci-devices", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <NodeDevices
              bus={NodeDeviceBus.PCIE}
              node={machine}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='node-device-1-numa']").text()).toBe(
      "128"
    );
  });
});
