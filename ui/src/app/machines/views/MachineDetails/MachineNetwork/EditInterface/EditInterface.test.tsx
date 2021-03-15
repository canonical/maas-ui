import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EditInterface from "./EditInterface";

import { NetworkInterfaceTypes } from "app/store/machine/types";
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

describe("EditInterface", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
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
          <EditInterface
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
            close={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a form for editing a physical interface", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditInterface
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
            close={jest.fn()}
            nicId={nic.id}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("EditPhysicalForm").exists()).toBe(true);
    expect(wrapper.find("FormCard").prop("title")).toBe("Edit Physical");
  });

  it("displays a form for editing an alias", () => {
    const link = networkLinkFactory();
    const nic = machineInterfaceFactory({
      links: [networkLinkFactory(), link],
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditInterface
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
            close={jest.fn()}
            linkId={link.id}
            nicId={nic.id}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("EditAliasOrVlanForm").exists()).toBe(true);
    expect(wrapper.find("FormCard").prop("title")).toBe("Edit Alias");
  });

  it("displays a form for editing a VLAN", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.VLAN,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditInterface
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
            close={jest.fn()}
            nicId={nic.id}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("EditAliasOrVlanForm").exists()).toBe(true);
    expect(wrapper.find("FormCard").prop("title")).toBe("Edit VLAN");
  });

  it("displays a form for editing a bridge", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.BRIDGE,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <EditInterface
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
            close={jest.fn()}
            nicId={nic.id}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("EditBridgeForm").exists()).toBe(true);
    expect(wrapper.find("FormCard").prop("title")).toBe("Edit Bridge");
  });
});
