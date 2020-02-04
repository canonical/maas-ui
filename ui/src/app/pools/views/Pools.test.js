import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import Pools from "./Pools";

const mockStore = configureStore();

describe("Pools", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: []
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: []
      },
      resourcepool: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default",
            description: "default",
            is_default: true,
            permissions: []
          },
          {
            id: 1,
            name: "Backup",
            description: "A backup pool",
            is_default: false,
            permissions: []
          }
        ]
      }
    };
  });

  it("displays a loading component if pools are loading", () => {
    const state = { ...initialState };
    state.resourcepool.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("disables the edit button without permissions", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    state.resourcepool.items = [
      {
        id: 0,
        name: "default",
        description: "default",
        is_default: true,
        permissions: []
      }
    ];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("Button")
        .first()
        .props().disabled
    ).toBe(true);
  });

  it("enables the edit button with correct permissions", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    state.resourcepool.items = [
      {
        id: 0,
        name: "default",
        description: "default",
        is_default: true,
        permissions: ["edit"]
      }
    ];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("Button")
        .first()
        .props().disabled
    ).toBe(false);
  });

  it("disables the delete button for default pools", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    state.resourcepool.items = [
      {
        id: 0,
        name: "default",
        description: "default",
        is_default: true,
        permissions: ["edit", "delete"]
      }
    ];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("Button")
        .at(1)
        .props().disabled
    ).toBe(true);
  });
});
