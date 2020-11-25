import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { machine as machineFactory } from "testing/factories";
import { PowerColumn } from "./PowerColumn";
import { NodeActions } from "app/store/types/node";

const mockStore = configureStore();

describe("PowerColumn", () => {
  let state;
  let machine;
  beforeEach(() => {
    machine = machineFactory();
    machine.system_id = "abc123";
    machine.power_state = "on";
    machine.power_type = "virsh";

    state = {
      config: {
        items: [],
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [machine],
      },
    };
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
    state.machine.items[0].power_state = "off";
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

    expect(wrapper.find('[data-test="power_state"]').text()).toEqual("off");
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

    expect(wrapper.find('[data-test="power_type"]').text()).toEqual("manual");
  });

  it("can show a menu item to turn a machine on", () => {
    state.machine.items[0].actions = [NodeActions.ON];
    state.machine.items[0].power_state = "off";
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
    state.machine.items[0].power_state = "unknown";
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
});
