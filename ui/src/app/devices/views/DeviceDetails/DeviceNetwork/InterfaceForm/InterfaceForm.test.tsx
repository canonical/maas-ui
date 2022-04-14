import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import InterfaceForm from "./InterfaceForm";

import type { DeviceNetworkInterface } from "app/store/device/types";
import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceInterface as deviceInterfaceFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
  fabric as fabricFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("InterfaceForm", () => {
  let state: RootState;
  let nic: DeviceNetworkInterface;
  beforeEach(() => {
    nic = deviceInterfaceFactory();
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [
          deviceDetailsFactory({
            system_id: "abc123",
          }),
        ],
        loaded: true,
        statuses: deviceStatusesFactory({
          abc123: deviceStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 1 }), subnetFactory({ id: 2 })],
        loaded: true,
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("displays a spinner if device is not detailed version", () => {
    state.device.items[0] = deviceFactory({ system_id: "abc123" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <InterfaceForm
          nicId={nic.id}
          onSubmit={jest.fn()}
          systemId="abc123"
          closeForm={jest.fn()}
        />
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='loading-device-details']").exists()
    ).toBe(true);
  });

  it("prefills the initial data if an existing nic is provided", () => {
    const nicData = {
      ip_address: "192.168.1.1",
      ip_assignment: DeviceIpAssignment.STATIC,
      mac_address: "11:22:33:44:55:66",
      name: "eth123",
      tags: ["tag1", "tag2"],
    };
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const subnet = subnetFactory({ cidr: "subnet-cidr", name: "subnet-name" });
    state.subnet.items = [subnet];
    const link = networkLinkFactory({ subnet_id: subnet.id });
    nic = deviceInterfaceFactory({
      ...nicData,
      discovered: [],
      links: [link],
      type: NetworkInterfaceTypes.PHYSICAL,
      vlan_id: vlan.id,
    });
    state.device.items = [
      deviceDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <InterfaceForm
          nicId={nic.id}
          linkId={link.id}
          onSubmit={jest.fn()}
          closeForm={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find(Formik).prop("initialValues")).toStrictEqual({
      ...nicData,
      subnet: subnet.id,
    });
  });

  it("sets the initial data if no nic is provided", () => {
    state.device.items[0] = deviceDetailsFactory({
      interfaces: [deviceInterfaceFactory({ name: "eth20" })],
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <InterfaceForm
          onSubmit={jest.fn()}
          closeForm={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find(Formik).prop("initialValues")).toStrictEqual({
      ip_address: "",
      ip_assignment: DeviceIpAssignment.DYNAMIC,
      mac_address: "",
      name: "eth21",
      subnet: "",
      tags: [],
    });
  });
});
