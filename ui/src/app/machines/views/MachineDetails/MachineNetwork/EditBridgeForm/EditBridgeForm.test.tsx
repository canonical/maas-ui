import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EditBridgeForm from "./EditBridgeForm";

import {
  BridgeType,
  NetworkInterfaceTypes,
  NetworkLinkMode,
} from "app/store/machine/types";
import type { NetworkInterface, NetworkLink } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("EditBridgeForm", () => {
  let nic: NetworkInterface;
  let link: NetworkLink;
  let state: RootState;
  beforeEach(() => {
    link = networkLinkFactory({});
    nic = machineInterfaceFactory({
      links: [link],
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state = rootStateFactory({
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
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditBridgeForm
            close={jest.fn()}
            link={link}
            nic={nic}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(store.getActions().some((action) => action.type === "vlan/fetch"));
  });

  it("displays a spinner when data is loading", () => {
    state.vlan.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditBridgeForm
            close={jest.fn()}
            link={link}
            nic={nic}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can dispatch an action to update a bridge", () => {
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditBridgeForm
            close={jest.fn()}
            link={link}
            nic={nic}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          bridge_fd: 15,
          bridge_stp: false,
          bridge_type: BridgeType.OVS,
          fabric: 1,
          ip_address: "1.2.3.4",
          mac_address: "28:21:c6:b9:1b:22",
          mode: NetworkLinkMode.LINK_UP,
          name: "br1",
          subnet: 1,
          tags: ["a", "tag"],
          vlan: 1,
        })
    );
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
          bridge_fd: 15,
          bridge_stp: false,
          bridge_type: BridgeType.OVS,
          fabric: 1,
          interface_id: nic.id,
          ip_address: "1.2.3.4",
          link_id: link.id,
          mac_address: "28:21:c6:b9:1b:22",
          mode: NetworkLinkMode.LINK_UP,
          name: "br1",
          subnet: 1,
          system_id: "abc123",
          tags: ["a", "tag"],
          vlan: 1,
        },
      },
    });
  });
});
