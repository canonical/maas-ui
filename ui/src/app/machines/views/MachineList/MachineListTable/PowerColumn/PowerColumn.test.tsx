import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { PowerColumn } from "./PowerColumn";

import { PowerTypeNames } from "app/store/general/constants";
import { PowerState } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("PowerColumn", () => {
  let state: RootState;
  let machine;
  beforeEach(() => {
    machine = machineFactory();
    machine.system_id = "abc123";
    machine.power_state = PowerState.ON;
    machine.power_type = PowerTypeNames.VIRSH;

    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [machine],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("PowerColumn")).toMatchSnapshot();
  });

  it("displays the correct power state", () => {
    state.machine.items[0].power_state = PowerState.OFF;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="power_state"]').text()).toEqual("off");
  });

  it("displays the correct power type", () => {
    state.machine.items[0].power_type = "manual";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="power_type"]').text()).toEqual("manual");
  });

  it("can show a menu item to turn a machine on", () => {
    state.machine.items[0].actions = [NodeActions.ON];
    state.machine.items[0].power_state = PowerState.OFF;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");

    expect(wrapper.find(".p-contextual-menu__link").at(0).text()).toEqual(
      "Turn on"
    );
  });

  it("can show a menu item to turn a machine off", () => {
    state.machine.items[0].actions = [NodeActions.OFF];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");

    expect(wrapper.find(".p-contextual-menu__link").at(0).text()).toEqual(
      "Turn off"
    );
  });

  it("can show a menu item to check power", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");

    expect(wrapper.find(".p-contextual-menu__link").at(0).text()).toEqual(
      "Check power"
    );
  });

  it("can show a message when there are no menu items", () => {
    state.machine.items[0].power_state = PowerState.UNKNOWN;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");

    expect(wrapper.find(".p-contextual-menu__link").at(1).text()).toEqual(
      "No power actions available"
    );
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableMenu").exists()).toBe(false);
  });

  it("shows a status tooltip if machine power is in error state", () => {
    state.machine.items[0].power_state = PowerState.ERROR;
    state.machine.items[0].status_message = "It's not working";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Tooltip").prop("message")).toBe("It's not working");
  });
});
