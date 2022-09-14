import reduxToolkit from "@reduxjs/toolkit";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DiscoveryAddForm from "./DiscoveryAddForm";
import { DeviceType } from "./types";

import FormikForm from "app/base/components/FormikForm";
import { actions as deviceActions } from "app/store/device";
import { DeviceIpAssignment, DeviceMeta } from "app/store/device/types";
import type { Discovery } from "app/store/discovery/types";
import type { RootState } from "app/store/root/types";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "app/store/types/node";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  deviceState as deviceStateFactory,
  domainState as domainStateFactory,
  machine as machineFactory,
  testStatus as testStatusFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  rootState as rootStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DiscoveryAddForm", () => {
  let state: RootState;
  let discovery: Discovery;

  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    const machines = [
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 4,
        cpu_test_status: testStatusFactory({
          status: TestStatusStatus.RUNNING,
        }),
        distro_series: "bionic",
        domain: modelRefFactory({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "koala.example",
        hostname: "koala",
        ip_addresses: [],
        memory: 8,
        memory_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        network_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        osystem: "ubuntu",
        owner: "admin",
        permissions: ["edit", "delete"],
        physical_disk_count: 1,
        pool: modelRefFactory(),
        pxe_mac: "00:11:22:33:44:55",
        spaces: [],
        status: NodeStatus.DEPLOYED,
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 8,
        storage_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        testing_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        system_id: "abc123",
        zone: modelRefFactory(),
      }),
    ];
    discovery = discoveryFactory({
      ip: "1.2.3.4",
      mac_address: "aa:bb:cc",
      subnet: 9,
      vlan: 8,
    });
    state = rootStateFactory({
      device: deviceStateFactory({ loaded: true }),
      discovery: discoveryStateFactory({
        loaded: true,
        items: [discovery],
      }),
      domain: domainStateFactory({ loaded: true }),
      machine: machineStateFactory({
        loaded: true,
        items: machines,
        lists: {
          "123456": machineStateListFactory({
            loaded: true,
            groups: [
              machineStateListGroupFactory({
                items: [machines[0].system_id],
                name: "Deployed",
              }),
            ],
          }),
        },
      }),
      subnet: subnetStateFactory({ loaded: true }),
      vlan: vlanStateFactory({ loaded: true }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <CompatRouter>
            <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "device/fetch",
      "domain/fetch",
      "machine/fetch",
      "subnet/fetch",
      "vlan/fetch",
    ];
    expectedActions.forEach((expectedAction) => {
      expect(
        store.getActions().some((action) => action.type === expectedAction)
      );
    });
  });

  it("displays a spinner when data is loading", () => {
    state.device.loaded = false;
    state.domain.loaded = false;
    state.machine.loaded = false;
    state.subnet.loaded = false;
    state.vlan.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <CompatRouter>
            <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("maps name errors to hostname", () => {
    state.device.errors = { name: "Name is invalid" };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <CompatRouter>
            <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikForm").prop("errors")).toStrictEqual({
      hostname: "Name is invalid",
    });
  });

  it("can dispatch to create a device", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <CompatRouter>
            <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper, {
      [DeviceMeta.PK]: "",
      domain: "local",
      hostname: "koala",
      ip_assignment: DeviceIpAssignment.DYNAMIC,
      parent: "abc123",
      type: DeviceType.DEVICE,
    });
    expect(
      store.getActions().find((action) => action.type === "device/create")
    ).toStrictEqual(
      deviceActions.create({
        domain: { name: "local" },
        extra_macs: [],
        hostname: "koala",
        interfaces: [
          {
            ip_address: "1.2.3.4",
            ip_assignment: DeviceIpAssignment.DYNAMIC,
            mac: "aa:bb:cc",
            subnet: 9,
          },
        ],
        parent: "abc123",
        primary_mac: "aa:bb:cc",
      })
    );
  });

  it("can dispatch to create a device interface", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <CompatRouter>
            <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper, {
      [DeviceMeta.PK]: "abc123",
      domain: "",
      hostname: "koala",
      ip_assignment: DeviceIpAssignment.DYNAMIC,
      parent: "",
      type: DeviceType.INTERFACE,
    });
    expect(
      store
        .getActions()
        .find((action) => action.type === "device/createInterface")
    ).toStrictEqual(
      deviceActions.createInterface({
        [DeviceMeta.PK]: "abc123",
        ip_address: "1.2.3.4",
        ip_assignment: DeviceIpAssignment.DYNAMIC,
        mac_address: "aa:bb:cc",
        name: "koala",
        subnet: 9,
        vlan: 8,
      })
    );
  });

  it("displays a success message when a hostname is provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <CompatRouter>
            <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const onSuccess = wrapper.find(FormikForm).prop("onSuccess");
    onSuccess &&
      onSuccess({
        hostname: "koala",
      });
    expect(
      store.getActions().find((action) => action.type === "message/add").payload
        .message
    ).toBe("koala has been added.");
  });

  it("displays a success message for a device with no hostname", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <CompatRouter>
            <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const onSuccess = wrapper.find(FormikForm).prop("onSuccess");
    onSuccess &&
      onSuccess({
        type: DeviceType.DEVICE,
      });
    expect(
      store.getActions().find((action) => action.type === "message/add").payload
        .message
    ).toBe("A device has been added.");
  });

  it("displays a success message for an interface with no hostname", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <CompatRouter>
            <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const onSuccess = wrapper.find(FormikForm).prop("onSuccess");
    onSuccess &&
      onSuccess({
        type: DeviceType.INTERFACE,
      });
    expect(
      store.getActions().find((action) => action.type === "message/add").payload
        .message
    ).toBe("An interface has been added.");
  });
});
