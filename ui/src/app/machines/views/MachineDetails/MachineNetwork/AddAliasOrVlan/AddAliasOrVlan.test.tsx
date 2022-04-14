import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddAliasOrVlan from "./AddAliasOrVlan";

import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddAliasOrVlan", () => {
  let state: RootState;
  let nic: NetworkInterface;
  beforeEach(() => {
    nic = machineInterfaceFactory();
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

  it("displays a spinner when data is loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddAliasOrVlan
            interfaceType={NetworkInterfaceTypes.VLAN}
            systemId="abc123"
            close={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a save-another button for aliases", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddAliasOrVlan
            interfaceType={NetworkInterfaceTypes.ALIAS}
            nic={nic}
            systemId="abc123"
            close={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("FormikFormContent").prop("secondarySubmitDisabled")
    ).toBe(false);
    expect(wrapper.find("FormikFormContent").prop("secondarySubmitLabel")).toBe(
      "Save and add another"
    );
  });

  it("displays a save-another button when there are unused VLANS", () => {
    const fabric = fabricFactory();
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id });
    state.vlan.items = [vlan, vlanFactory({ fabric: fabric.id })];
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.PHYSICAL,
      vlan_id: vlan.id,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddAliasOrVlan
            interfaceType={NetworkInterfaceTypes.VLAN}
            nic={nic}
            systemId="abc123"
            close={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("FormikFormContent").prop("secondarySubmitDisabled")
    ).toBe(false);
    expect(
      wrapper.find("FormikFormContent").prop("secondarySubmitTooltip")
    ).toBe(null);
  });

  it("disables the save-another button when there are no unused VLANS", () => {
    state.vlan.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddAliasOrVlan
            nic={nic}
            interfaceType={NetworkInterfaceTypes.VLAN}
            systemId="abc123"
            close={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("FormikFormContent").prop("secondarySubmitDisabled")
    ).toBe(true);
    expect(
      wrapper.find("FormikFormContent").prop("secondarySubmitTooltip")
    ).toBe("There are no more unused VLANS for this interface.");
  });

  it("correctly initialises fabric and VLAN when adding an alias", () => {
    const fabric = fabricFactory({ id: 1 });
    const vlan = vlanFactory({ fabric: fabric.id, id: 5001 });
    const nic = machineInterfaceFactory({ vlan_id: vlan.id });
    const machine = machineDetailsFactory({
      system_id: "abc123",
      interfaces: [nic],
    });
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabric],
        loaded: true,
        loading: false,
      }),
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          [machine.system_id]: machineStatusFactory(),
        }),
      }),
      vlan: vlanStateFactory({
        items: [vlan],
        loaded: true,
        loading: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddAliasOrVlan
            interfaceType={NetworkInterfaceTypes.ALIAS}
            nic={nic}
            systemId="abc123"
            close={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .findWhere(
          (node) =>
            node.name() === "select" &&
            node.prop("name") === "fabric" &&
            node.prop("value") === fabric.id
        )
        .exists()
    ).toBe(true);
    expect(
      wrapper
        .findWhere(
          (node) =>
            node.name() === "select" &&
            node.prop("name") === "vlan" &&
            node.prop("value") === vlan.id
        )
        .exists()
    ).toBe(true);
  });

  it("correctly dispatches actions to add a VLAN", () => {
    const nic = machineInterfaceFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddAliasOrVlan
            interfaceType={NetworkInterfaceTypes.VLAN}
            nic={nic}
            systemId="abc123"
            close={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        ip_address: "1.2.3.4",
        mode: NetworkLinkMode.AUTO,
        tags: ["koala", "tag"],
        vlan: 9,
      })
    );
    expect(
      store.getActions().find((action) => action.type === "machine/createVlan")
    ).toStrictEqual({
      type: "machine/createVlan",
      meta: {
        model: "machine",
        method: "create_vlan",
      },
      payload: {
        params: {
          ip_address: "1.2.3.4",
          mode: NetworkLinkMode.AUTO,
          parent: nic.id,
          system_id: "abc123",
          tags: ["koala", "tag"],
          vlan: 9,
        },
      },
    });
  });

  it("correctly dispatches actions to add an alias", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddAliasOrVlan
            interfaceType={NetworkInterfaceTypes.ALIAS}
            nic={nic}
            systemId="abc123"
            close={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        ip_address: "1.2.3.4",
        mode: NetworkLinkMode.AUTO,
        subnet: 3,
        system_id: "abc123",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "machine/linkSubnet")
    ).toStrictEqual({
      type: "machine/linkSubnet",
      meta: {
        model: "machine",
        method: "link_subnet",
      },
      payload: {
        params: {
          interface_id: nic.id,
          ip_address: "1.2.3.4",
          mode: NetworkLinkMode.AUTO,
          subnet: 3,
          system_id: "abc123",
        },
      },
    });
  });
});
