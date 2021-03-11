import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { ExpandedState } from "../types";

import NetworkTableConfirmation from "./NetworkTableConfirmation";

import type { NetworkInterface } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkTableConfirmation", () => {
  let nic: NetworkInterface;
  let state: RootState;
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
        loaded: true,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  it("does not display a confirmation if it is not expanded", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableConfirmation
          expanded={null}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("ActionConfirm").exists()).toBe(false);
  });

  describe("delete confirmation", () => {
    it("can display a delete confirmation for an interface", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.REMOVE,
            }}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      const confirmation = wrapper.find("ActionConfirm");
      expect(confirmation.prop("eventName")).toBe("deleteInterface");
      expect(confirmation.prop("message")).toBe(
        "Are you sure you want to remove this interface?"
      );
      expect(confirmation.prop("statusKey")).toBe("deletingInterface");
    });

    it("can confirm deleting an interface", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.REMOVE,
            }}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      wrapper.find("ActionConfirm ActionButton").simulate("click");
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/deleteInterface")
      ).toStrictEqual({
        type: "machine/deleteInterface",
        meta: {
          method: "delete_interface",
          model: "machine",
        },
        payload: {
          params: {
            interface_id: nic.id,
            system_id: "abc123",
          },
        },
      });
    });

    it("can display a delete confirmation for an alias", () => {
      const link = networkLinkFactory();
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              discovered: null,
              links: [networkLinkFactory(), link],
              name: "alias",
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.REMOVE,
            }}
            link={link}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      const confirmation = wrapper.find("ActionConfirm");
      expect(confirmation.prop("eventName")).toBe("unlinkSubnet");
      expect(confirmation.prop("message")).toBe(
        "Are you sure you want to remove this Alias?"
      );
      expect(confirmation.prop("statusKey")).toBe("unlinkingSubnet");
    });

    it("can confirm deleting an alias", () => {
      const link = networkLinkFactory();
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              discovered: null,
              links: [networkLinkFactory(), link],
              name: "alias",
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.REMOVE,
            }}
            link={link}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      wrapper.find("ActionConfirm ActionButton").simulate("click");
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/unlinkSubnet")
      ).toStrictEqual({
        type: "machine/unlinkSubnet",
        meta: {
          method: "unlink_subnet",
          model: "machine",
        },
        payload: {
          params: {
            interface_id: nic.id,
            link_id: link.id,
            system_id: "abc123",
          },
        },
      });
    });
  });

  describe("connect/disconnect confirmations", () => {
    it("can display a mark connected confirmation", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.MARK_CONNECTED,
            }}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      const confirmation = wrapper.find("ActionConfirm");
      expect(confirmation.prop("eventName")).toBe("updateInterface");
      expect(confirmation.prop("confirmLabel")).toBe("Mark as connected");
      expect(confirmation.prop("statusKey")).toBe("updatingInterface");
      expect(confirmation.prop("submitAppearance")).toBe("positive");
    });

    it("can display a mark disconnected confirmation", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.MARK_DISCONNECTED,
            }}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      const confirmation = wrapper.find("ActionConfirm");
      expect(confirmation.prop("eventName")).toBe("updateInterface");
      expect(confirmation.prop("confirmLabel")).toBe("Mark as disconnected");
      expect(confirmation.prop("statusKey")).toBe("updatingInterface");
      expect(confirmation.prop("submitAppearance")).toBe("negative");
    });

    it("can display a disconnected warning", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.DISCONNECTED_WARNING,
            }}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      const confirmation = wrapper.find("ActionConfirm");
      expect(confirmation.prop("eventName")).toBe("updateInterface");
      expect(confirmation.prop("confirmLabel")).toBe("Mark as connected");
      expect(confirmation.prop("statusKey")).toBe("updatingInterface");
      expect(confirmation.prop("submitAppearance")).toBe("positive");
    });

    it("can confirm marking connected", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.MARK_CONNECTED,
            }}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      wrapper.find("ActionConfirm ActionButton").simulate("click");
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/updateInterface")
      ).toStrictEqual({
        type: "machine/updateInterface",
        meta: {
          method: "update_interface",
          model: "machine",
        },
        payload: {
          params: {
            interface_id: nic.id,
            link_connected: true,
            system_id: "abc123",
          },
        },
      });
    });

    it("can confirm marking disconnected", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <NetworkTableConfirmation
            expanded={{
              content: ExpandedState.MARK_DISCONNECTED,
            }}
            nic={nic}
            setExpanded={jest.fn()}
            systemId="abc123"
          />
        </Provider>
      );
      wrapper.find("ActionConfirm ActionButton").simulate("click");
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/updateInterface")
      ).toStrictEqual({
        type: "machine/updateInterface",
        meta: {
          method: "update_interface",
          model: "machine",
        },
        payload: {
          params: {
            interface_id: nic.id,
            link_connected: false,
            system_id: "abc123",
          },
        },
      });
    });
  });

  it("can display an add alias form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.ADD_ALIAS,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("AddAliasOrVlan").exists()).toBe(true);
    expect(wrapper.find("AddAliasOrVlan").prop("interfaceType")).toBe(
      NetworkInterfaceTypes.ALIAS
    );
  });

  it("can display an add VLAN form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.ADD_VLAN,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("AddAliasOrVlan").exists()).toBe(true);
    expect(wrapper.find("AddAliasOrVlan").prop("interfaceType")).toBe(
      NetworkInterfaceTypes.VLAN
    );
  });
});
