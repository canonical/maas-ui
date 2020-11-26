import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { PoolColumn } from "./PoolColumn";

import { NodeActions } from "app/store/types/node";

const mockStore = configureStore();

describe("PoolColumn", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
            pool: { id: 0, name: "default" },
            description: "Firmware old",
            actions: [NodeActions.SET_POOL],
          },
        ],
      },
      resourcepool: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default",
          },
          {
            id: 1,
            name: "Backup",
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
          <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("PoolColumn")).toMatchSnapshot();
  });

  it("displays pool", () => {
    state.machine.items[0].pool = { name: "pool-1" };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="pool"]').text()).toEqual("pool-1");
  });

  it("displays description", () => {
    state.machine.items[0].description = "decomissioned";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="note"]').text()).toEqual("decomissioned");
  });

  it("displays a message if there are no additional pools", () => {
    state.resourcepool.items = [
      {
        id: 0,
        name: "default",
      },
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    const items = wrapper.find("DoubleRow").prop("menuLinks");
    expect(items.length).toBe(1);
    expect(items[0]).toStrictEqual({
      children: "No other pools available",
      disabled: true,
    });
  });

  it("displays a message if the machine cannot have its pool changed", () => {
    state.machine.items[0].actions = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    const items = wrapper.find("DoubleRow").prop("menuLinks");
    expect(items.length).toBe(1);
    expect(items[0]).toStrictEqual({
      children: "Cannot change pool of this machine",
      disabled: true,
    });
  });

  it("can change pools", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("DoubleRow").prop("menuLinks")[0].onClick();
    });
    expect(
      store.getActions().find((action) => action.type === "machine/setPool")
    ).toEqual({
      type: "machine/setPool",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.SET_POOL,
          extra: {
            pool_id: 1,
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("shows a spinner when changing pools", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PoolColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(false);
    act(() => {
      wrapper.find("DoubleRow").prop("menuLinks")[0].onClick();
    });
    wrapper.update();
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <PoolColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableMenu").exists()).toBe(false);
  });
});
