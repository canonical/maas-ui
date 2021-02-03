import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { ExpandedState } from "../types";

import NetworkTableActions from "./NetworkTableActions";

import type { NetworkInterface } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineInterface as machineInterfaceFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkTableActions", () => {
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
      }),
    });
  });

  it("can display the menu", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("TableMenu").exists()).toBe(true);
    expect(wrapper.find("TableMenu").prop("disabled")).toBe(false);
  });

  it("disables menu when networking is disabled and limited editing is not allowed", () => {
    state.machine.items[0].permissions = [];
    state.machine.items[0].status = NodeStatus.NEW;
    nic.type = NetworkInterfaceTypes.VLAN;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    expect(wrapper.find("TableMenu").prop("disabled")).toBe(true);
  });

  it("can display an item to mark an interface as connected", () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper.update();
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.type() === "button" &&
            n.hasClass("p-contextual-menu__link") &&
            n.text() === "Mark as connected"
        )
        .exists()
    ).toBe(true);
  });

  it("can display an item to mark an interface as disconnected", () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper.update();
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.type() === "button" &&
            n.hasClass("p-contextual-menu__link") &&
            n.text() === "Mark as disconnected"
        )
        .exists()
    ).toBe(true);
  });

  it("can display an item to remove the interface", () => {
    nic.type = NetworkInterfaceTypes.BOND;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper.update();
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.type() === "button" &&
            n.hasClass("p-contextual-menu__link") &&
            n.text() === "Remove Bond..."
        )
        .exists()
    ).toBe(true);
  });

  it("can display an item to edit the interface", () => {
    nic.type = NetworkInterfaceTypes.BOND;
    const setExpanded = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions
          nic={nic}
          setExpanded={setExpanded}
          systemId="abc123"
        />
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper.update();
    const item = wrapper.findWhere(
      (n) =>
        n.type() === "button" &&
        n.hasClass("p-contextual-menu__link") &&
        n.text() === "Edit Bond"
    );
    expect(item.exists()).toBe(true);
    item.simulate("click");
    expect(setExpanded).toHaveBeenCalledWith({
      content: ExpandedState.EDIT,
      nicId: nic.id,
    });
  });

  it("can display a warning when trying to edit a disconnected interface", () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = false;
    const setExpanded = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTableActions
          nic={nic}
          setExpanded={setExpanded}
          systemId="abc123"
        />
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper.update();
    const item = wrapper.findWhere(
      (n) =>
        n.type() === "button" &&
        n.hasClass("p-contextual-menu__link") &&
        n.text() === "Edit Physical"
    );
    expect(item.exists()).toBe(true);
    item.simulate("click");
    expect(setExpanded).toHaveBeenCalledWith({
      content: ExpandedState.DISCONNECTED_WARNING,
      nicId: nic.id,
    });
  });
});
