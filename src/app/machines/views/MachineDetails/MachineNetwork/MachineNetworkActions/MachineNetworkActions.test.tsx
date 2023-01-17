import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineNetworkActions from "./MachineNetworkActions";

import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import { MachineHeaderViews } from "app/machines/constants";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import { NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineNetworkActions", () => {
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
            <MachineNetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find("Button").last().prop("disabled")).toBe(true);
    });

    it("shows the test form when clicking the button", () => {
      const store = mockStore(state);
      const setSidePanelContent = jest.fn();
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <MachineNetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSidePanelContent={setSidePanelContent}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper.find("Button").last().simulate("click");
      expect(setSidePanelContent).toHaveBeenCalledWith({
        view: MachineHeaderViews.TEST_MACHINE,
        extras: { applyConfiguredNetworking: true },
      });
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
            <MachineNetworkActions
              expanded={null}
              selected={[{ nicId: 1 }, { nicId: 2 }]}
              setExpanded={setExpanded}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper.find("Button[data-testid='addBond']").simulate("click");
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
            <MachineNetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBond']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBond-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when no interfaces are selected", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <MachineNetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBond']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBond-tooltip']").exists()
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
            <MachineNetworkActions
              expanded={null}
              selected={[{ nicId: 1 }]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBond']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBond-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when some selected interfaces are not physical", () => {
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
            <MachineNetworkActions
              expanded={null}
              selected={[{ nicId: 1, linkId: 2 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBond']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBond-tooltip']").exists()
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
            <MachineNetworkActions
              expanded={null}
              selected={[{ nicId: 1, linkId: 2 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBond']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBond-tooltip']").exists()
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
            <MachineNetworkActions
              expanded={null}
              selected={[{ nicId: 1 }]}
              setExpanded={setExpanded}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper.find("Button[data-testid='addBridge']").simulate("click");
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
            <MachineNetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBridge-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when no interfaces are selected", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <MachineNetworkActions
              expanded={null}
              selected={[]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBridge-tooltip']").exists()
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
            <MachineNetworkActions
              expanded={null}
              selected={[{ nicId: 1 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBridge-tooltip']").exists()
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
            <MachineNetworkActions
              expanded={null}
              selected={[{ nicId: 1, linkId: 2 }]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBridge-tooltip']").exists()
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
            <MachineNetworkActions
              expanded={null}
              selected={[{ nicId: 1 }, { nicId: 2 }]}
              setExpanded={jest.fn()}
              setSidePanelContent={jest.fn()}
              systemId="abc123"
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addBridge']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addBridge-tooltip']").exists()
      ).toBe(true);
    });
  });
});
