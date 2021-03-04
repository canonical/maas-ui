import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { ExpandedState } from "../NetworkTable/types";

import NetworkActions from "./NetworkActions";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeActions, NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkActions", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  describe("validate network", () => {
    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Button").last().prop("disabled")).toBe(true);
    });

    it("shows the test form when clicking the button", () => {
      const store = mockStore(state);
      const setSelectedAction = jest.fn();
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSelectedAction={setSelectedAction}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper.find("Button").last().simulate("click");
      expect(setSelectedAction).toHaveBeenCalledWith({
        name: NodeActions.TEST,
        formProps: { applyConfiguredNetworking: true },
      });
    });
  });

  describe("add physical", () => {
    it("sets the state to show the form when clicking the button", () => {
      const store = mockStore(state);
      const setExpanded = jest.fn();
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[]}
              setExpanded={setExpanded}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper.find("Button[data-test='addPhysical']").simulate("click");
      expect(setExpanded).toHaveBeenCalledWith({
        content: ExpandedState.ADD_PHYSICAL,
      });
    });

    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-test='addPhysical']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-test='addPhysical-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when the form is expanded", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={{ content: ExpandedState.ADD_PHYSICAL }}
              selected={[]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-test='addPhysical']").prop("disabled")
      ).toBe(true);
    });
  });

  describe("create bond", () => {
    it("sets the state to show the form when clicking the button", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const setExpanded = jest.fn();
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1 }, { nicId: 2 }]}
              setExpanded={setExpanded}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper.find("Button[data-test='addBond']").simulate("click");
      expect(setExpanded).toHaveBeenCalledWith({
        content: ExpandedState.ADD_BOND,
      });
    });

    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Button[data-test='addBond']").prop("disabled")).toBe(
        true
      );
      expect(
        wrapper.find("Tooltip[data-test='addBond-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when no interfaces are selected", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Button[data-test='addBond']").prop("disabled")).toBe(
        true
      );
      expect(
        wrapper.find("Tooltip[data-test='addBond-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when only 1 interface is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1 }]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Button[data-test='addBond']").prop("disabled")).toBe(
        true
      );
      expect(
        wrapper.find("Tooltip[data-test='addBond-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when an alias is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              links: [
                networkLinkFactory({ id: 1 }),
                networkLinkFactory({ id: 2 }),
              ],
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1, linkId: 2 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Button[data-test='addBond']").prop("disabled")).toBe(
        true
      );
      expect(
        wrapper.find("Tooltip[data-test='addBond-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when a bond is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.BOND,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Button[data-test='addBond']").prop("disabled")).toBe(
        true
      );
      expect(
        wrapper.find("Tooltip[data-test='addBond-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when selected interfaces have different VLANS", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 2,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1, linkId: 2 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Button[data-test='addBond']").prop("disabled")).toBe(
        true
      );
      expect(
        wrapper.find("Tooltip[data-test='addBond-tooltip']").exists()
      ).toBe(true);
    });
  });

  describe("create bridge", () => {
    it("sets the state to show the form when clicking the button", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const setExpanded = jest.fn();
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1 }]}
              setExpanded={setExpanded}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper.find("Button[data-test='addBridge']").simulate("click");
      expect(setExpanded).toHaveBeenCalledWith({
        content: ExpandedState.ADD_BRIDGE,
      });
    });

    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-test='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-test='addBridge-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when no interfaces are selected", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-test='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-test='addBridge-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when more than 1 interface is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-test='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-test='addBridge-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when an alias is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              links: [
                networkLinkFactory({ id: 1 }),
                networkLinkFactory({ id: 2 }),
              ],
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1, linkId: 2 }]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-test='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-test='addBridge-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when a bridge is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.BRIDGE,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActions
              expanded={null}
              selected={[{ nicId: 1 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSelectedAction={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-test='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-test='addBridge-tooltip']").exists()
      ).toBe(true);
    });
  });
});
