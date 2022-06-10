import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddDeviceForm from "./AddDeviceForm";

import { actions as deviceActions } from "app/store/device";
import { DeviceIpAssignment } from "app/store/device/types";
import { actions as domainActions } from "app/store/domain";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import { actions as zoneActions } from "app/store/zone";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddDeviceForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 0, name: "maas" })],
        loaded: true,
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 0, name: "subnet" })],
        loaded: true,
      }),
      zone: zoneStateFactory({
        items: [zoneFactory({ id: 0, name: "default" })],
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AddDeviceForm clearHeaderContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const expectedActions = [
      domainActions.fetch(),
      subnetActions.fetch(),
      zoneActions.fetch(),
    ];
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) => actualAction.type === expectedAction.type
        )
      ).toStrictEqual(expectedAction);
    });
  });

  it("displays a spinner if data has not loaded", () => {
    state.zone.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AddDeviceForm clearHeaderContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can handle saving a device", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AddDeviceForm clearHeaderContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper, {
      domain: "maas",
      hostname: "plot-device",
      interfaces: [
        {
          id: 0,
          ip_address: "192.168.1.1",
          ip_assignment: DeviceIpAssignment.STATIC,
          mac: "11:11:11:11:11:11",
          name: "eth0",
          subnet: 0,
        },
        {
          id: 1,
          ip_address: "192.168.1.2",
          ip_assignment: DeviceIpAssignment.EXTERNAL,
          mac: "22:22:22:22:22:22",
          name: "eth1",
          subnet: "",
        },
        {
          id: 2,
          ip_address: "",
          ip_assignment: DeviceIpAssignment.DYNAMIC,
          mac: "33:33:33:33:33:33",
          name: "eth2",
          subnet: "",
        },
      ],
      zone: "default",
    });

    const expectedAction = deviceActions.create({
      domain: { name: "maas" },
      extra_macs: ["22:22:22:22:22:22", "33:33:33:33:33:33"],
      hostname: "plot-device",
      interfaces: [
        {
          ip_address: "192.168.1.1",
          ip_assignment: DeviceIpAssignment.STATIC,
          mac: "11:11:11:11:11:11",
          name: "eth0",
          subnet: 0,
        },
        {
          ip_address: "192.168.1.2",
          ip_assignment: DeviceIpAssignment.EXTERNAL,
          mac: "22:22:22:22:22:22",
          name: "eth1",
          subnet: null,
        },
        {
          ip_address: null,
          ip_assignment: DeviceIpAssignment.DYNAMIC,
          mac: "33:33:33:33:33:33",
          name: "eth2",
          subnet: null,
        },
      ],
      primary_mac: "11:11:11:11:11:11",
      zone: { name: "default" },
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
