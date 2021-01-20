import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NodeDevices from "./NodeDevices";

import { HardwareType } from "app/base/enum";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import { NodeActions } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineNumaNode as numaNodeFactory,
  nodeDevice as nodeDeviceFactory,
  nodeDeviceState as nodeDeviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NodeDevices", () => {
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
          machine={machine}
          setSelectedAction={jest.fn()}
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
          machine={machine}
          setSelectedAction={jest.fn()}
        />
      </Provider>
    );

    expect(wrapper.find("[data-test='pci-address-col']").exists()).toBe(true);
  });

  it("shows bus and device address columns if showing USB devices", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NodeDevices
          bus={NodeDeviceBus.USB}
          machine={machine}
          setSelectedAction={jest.fn()}
        />
      </Provider>
    );

    expect(wrapper.find("[data-test='bus-address-col']").exists()).toBe(true);
    expect(wrapper.find("[data-test='device-address-col']").exists()).toBe(
      true
    );
  });

  it(`prompts user to commission machine if no devices found and machine can be
    commissioned`, () => {
    const setSelectedAction = jest.fn();
    const machine = machineDetailsFactory({
      actions: [NodeActions.COMMISSION],
    });
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NodeDevices
          bus={NodeDeviceBus.PCIE}
          machine={machine}
          setSelectedAction={setSelectedAction}
        />
      </Provider>
    );

    expect(wrapper.find("[data-test='no-devices']").exists()).toBe(true);

    wrapper.find("[data-test='commission-machine'] button").simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith({
      name: NodeActions.COMMISSION,
    });
  });

  it("shows a message if the machine has PCI devices but no USB devices", () => {
    const machine = machineDetailsFactory();
    const state = rootStateFactory({
      nodedevice: nodeDeviceStateFactory({
        items: [
          nodeDeviceFactory({ bus: NodeDeviceBus.PCIE, node_id: machine.id }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NodeDevices
          bus={NodeDeviceBus.USB}
          machine={machine}
          setSelectedAction={jest.fn()}
        />
      </Provider>
    );

    expect(wrapper.find("[data-test='no-usb']").exists()).toBe(true);
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
          <NodeDevices
            bus={NodeDeviceBus.PCIE}
            machine={machine}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .find("[data-test='group-label']")
        .at(0)
        .find(".p-double-row__primary-row")
        .text()
    ).toBe("Network");
    expect(
      wrapper
        .find("[data-test='group-label']")
        .at(0)
        .find(".p-double-row__secondary-row")
        .text()
    ).toBe("1 device");
    expect(
      wrapper
        .find("[data-test='group-label']")
        .at(1)
        .find(".p-double-row__primary-row")
        .text()
    ).toBe("Storage");
    expect(
      wrapper
        .find("[data-test='group-label']")
        .at(1)
        .find(".p-double-row__secondary-row")
        .text()
    ).toBe("3 devices");
  });

  it("can link to the network and storage tabs", () => {
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
          <NodeDevices
            bus={NodeDeviceBus.PCIE}
            machine={machine}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .find("[data-test='group-label']")
        .at(0)
        .find("LegacyLink")
        .prop("route")
    ).toBe("/machine/abc123?area=network");
    expect(
      wrapper
        .find("[data-test='group-label']")
        .at(1)
        .find("LegacyLink")
        .prop("route")
    ).toBe("/machine/abc123?area=storage");
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
          <NodeDevices
            bus={NodeDeviceBus.PCIE}
            machine={machine}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='node-device-1-numa']").text()).toBe("128");
  });
});
