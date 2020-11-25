import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { OwnerColumn } from "./OwnerColumn";

import { NodeActions } from "app/store/types/node";

const mockStore = configureStore();

describe("OwnerColumn", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      general: {
        machineActions: {
          data: [
            { name: NodeActions.ACQUIRE, title: "Acquire..." },
            { name: NodeActions.RELEASE, title: "Release..." },
          ],
        },
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            actions: [],
            system_id: "abc123",
            owner: "admin",
            tags: [],
          },
        ],
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
          <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("OwnerColumn")).toMatchSnapshot();
  });

  it("displays owner", () => {
    state.machine.items[0].owner = "user1";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="owner"]').text()).toEqual("user1");
  });

  it("displays tags", () => {
    state.machine.items[0].tags = ["minty", "aloof"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="tags"]').text()).toEqual("minty, aloof");
  });

  it("can show a menu item to acquire a machine", () => {
    state.machine.items[0].actions = [NodeActions.ACQUIRE];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find(".p-contextual-menu__link").at(0).text()).toEqual(
      "Acquire..."
    );
  });

  it("can show a menu item to release a machine", () => {
    state.machine.items[0].actions = [NodeActions.RELEASE];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find(".p-contextual-menu__link").at(0).text()).toEqual(
      "Release..."
    );
  });

  it("can show a message when there are no menu items", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OwnerColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find(".p-contextual-menu__link").at(1).text()).toEqual(
      "No owner actions available"
    );
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OwnerColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableMenu").exists()).toBe(false);
  });
});
