import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EditAliasOrVlanForm from "./EditAliasOrVlanForm";

import {
  NetworkInterfaceTypes,
  NetworkLinkMode,
} from "app/store/machine/types";
import type { NetworkInterface } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("EditAliasOrVlanForm", () => {
  let nic: NetworkInterface;
  let state: RootState;

  beforeEach(() => {
    nic = machineInterfaceFactory({
      id: 1,
    });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabricFactory({}), fabricFactory()],
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory(), subnetFactory()],
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [vlanFactory(), vlanFactory()],
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditAliasOrVlanForm
            close={jest.fn()}
            interfaceType={NetworkInterfaceTypes.VLAN}
            nic={nic}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["fabric/fetch", "subnet/fetch", "vlan/fetch"];
    expectedActions.forEach((expectedAction) => {
      expect(
        store.getActions().some((action) => action.type === expectedAction)
      );
    });
  });

  it("displays a spinner when data is loading", () => {
    state.fabric.loaded = false;
    state.subnet.loaded = false;
    state.vlan.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditAliasOrVlanForm
            close={jest.fn()}
            interfaceType={NetworkInterfaceTypes.VLAN}
            nic={nic}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a tag field for a VLAN", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditAliasOrVlanForm
            close={jest.fn()}
            interfaceType={NetworkInterfaceTypes.VLAN}
            nic={nic}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("TagField").exists()).toBe(true);
  });

  it("dispatches an action to update an alias", async () => {
    const link = networkLinkFactory({});
    nic.links = [networkLinkFactory(), link];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditAliasOrVlanForm
            close={jest.fn()}
            interfaceType={NetworkInterfaceTypes.ALIAS}
            link={link}
            nic={nic}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("Formik").props().onSubmit({
      fabric: 1,
      ip_address: "1.2.3.4",
      mode: NetworkLinkMode.STATIC,
      subnet: 1,
      vlan: 1,
    });
    await waitForComponentToPaint(wrapper);
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateInterface")
    ).toStrictEqual({
      type: "machine/updateInterface",
      meta: {
        model: "machine",
        method: "update_interface",
      },
      payload: {
        params: {
          fabric: 1,
          interface_id: nic.id,
          ip_address: "1.2.3.4",
          link_id: link.id,
          mode: NetworkLinkMode.STATIC,
          subnet: 1,
          system_id: "abc123",
          vlan: 1,
        },
      },
    });
  });

  it("dispatches an action to update a VLAN", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditAliasOrVlanForm
            close={jest.fn()}
            interfaceType={NetworkInterfaceTypes.VLAN}
            nic={nic}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper
      .find("Formik")
      .props()
      .onSubmit({
        fabric: 1,
        ip_address: "1.2.3.4",
        mode: NetworkLinkMode.STATIC,
        subnet: 1,
        tags: ["a", "tag"],
        vlan: 1,
      });
    await waitForComponentToPaint(wrapper);
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateInterface")
    ).toStrictEqual({
      type: "machine/updateInterface",
      meta: {
        model: "machine",
        method: "update_interface",
      },
      payload: {
        params: {
          fabric: 1,
          interface_id: nic.id,
          ip_address: "1.2.3.4",
          mode: NetworkLinkMode.STATIC,
          subnet: 1,
          system_id: "abc123",
          tags: ["a", "tag"],
          vlan: 1,
        },
      },
    });
  });
});
