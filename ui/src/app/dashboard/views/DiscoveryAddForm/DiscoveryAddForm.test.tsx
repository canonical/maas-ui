import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DiscoveryAddForm from "./DiscoveryAddForm";
import { DeviceType } from "./types";

import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as deviceActions } from "app/store/device";
import { DeviceIpAssignment, DeviceMeta } from "app/store/device/types";
import type { Discovery } from "app/store/discovery/types";
import type { RootState } from "app/store/root/types";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  deviceState as deviceStateFactory,
  domainState as domainStateFactory,
  machineState as machineStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DiscoveryAddForm", () => {
  let state: RootState;
  let discovery: Discovery;

  beforeEach(() => {
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
      machine: machineStateFactory({ loaded: true }),
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
          <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
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
          <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
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
          <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikFormContent").prop("errors")).toStrictEqual({
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
          <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
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
          <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
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
          <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    const onSuccess = wrapper.find(FormikFormContent).prop("onSuccess");
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
          <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const onSuccess = wrapper.find(FormikFormContent).prop("onSuccess");
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
          <DiscoveryAddForm discovery={discovery} onClose={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    const onSuccess = wrapper.find(FormikFormContent).prop("onSuccess");
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
