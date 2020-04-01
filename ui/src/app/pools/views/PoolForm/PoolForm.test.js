import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { PoolForm } from "./PoolForm";

const mockStore = configureStore();

describe("PoolForm", () => {
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
        items: [],
      },
      resourcepool: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default",
            description: "default",
            is_default: true,
            permissions: [],
          },
          {
            id: 1,
            name: "Backup",
            description: "A backup pool",
            is_default: false,
            permissions: [],
          },
        ],
      },
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("PoolForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(store.getActions()[0]).toEqual({
      type: "CLEANUP_RESOURCEPOOL",
    });
  });

  it("redirects when the resource pool is saved", () => {
    state.resourcepool.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pool/add"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can create a resource pool", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pools/add"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("FormikForm").at(0).props().onSubmit(
        {
          name: "pool-1",
          description: "a pool",
        },
        {}
      )
    );
    expect(store.getActions()[1]).toEqual({
      type: "CREATE_RESOURCEPOOL",
      payload: {
        params: {
          name: "pool-1",
          description: "a pool",
        },
      },
      meta: {
        model: "resourcepool",
        method: "create",
      },
    });
  });

  it("can update a resource pool", () => {
    const store = mockStore(state);
    const pool = {
      id: 2,
      name: "pool1",
      description: "a pool",
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/pools/", key: "testKey" }]}
        >
          <PoolForm pool={pool} />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("Formik").props().onSubmit({
        name: "newName",
        description: "new description",
      });
    });
    const action = store
      .getActions()
      .find((action) => action.type === "UPDATE_RESOURCEPOOL");
    expect(action).toEqual({
      type: "UPDATE_RESOURCEPOOL",
      payload: {
        params: {
          id: 2,
          name: "newName",
          description: "new description",
        },
      },
      meta: {
        model: "resourcepool",
        method: "update",
      },
    });
  });

  it("adds a message when a resource pool is added", () => {
    state.resourcepool.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <PoolForm />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "CLEANUP_RESOURCEPOOL")
    ).toBe(true);
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
