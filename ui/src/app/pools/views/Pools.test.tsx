import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Pools from "./Pools";

import type { RootState } from "app/store/root/types";
import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Pools", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [resourcePoolFactory({ name: "default" })],
      }),
    });
  });

  it("displays a loading component if pools are loading", () => {
    state.resourcepool.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("disables the edit button without permissions", () => {
    state.resourcepool.items = [resourcePoolFactory({ permissions: [] })];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Button").first().props().disabled).toBe(true);
  });

  it("enables the edit button with correct permissions", () => {
    state.resourcepool.items = [resourcePoolFactory({ permissions: ["edit"] })];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Button").first().props().disabled).toBe(false);
  });

  it("can show a delete confirmation", () => {
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 0,
        name: "squambo",
        description: "a pool",
        is_default: false,
        machine_total_count: 0,
        permissions: ["delete"],
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableRow").at(1).hasClass("is-active")).toBe(false);
    // Click on the delete button:
    wrapper
      .find("TableRow")
      .at(1)
      .find("Button[data-testid='table-actions-delete']")
      .simulate("click");
    expect(wrapper.find("TableRow").at(1).hasClass("is-active")).toBe(true);
  });

  it("can delete a pool", () => {
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 2,
        name: "squambo",
        description: "a pool",
        is_default: false,
        machine_total_count: 0,
        permissions: ["delete"],
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper
      .find("TableRow")
      .at(1)
      .find("Button[data-testid='table-actions-delete']")
      .simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("TableRow")
      .at(1)
      .find("ActionButton[data-testid='action-confirm']")
      .simulate("click");

    expect(store.getActions()[2]).toEqual({
      type: "resourcepool/delete",
      payload: {
        params: {
          id: 2,
        },
      },
      meta: {
        model: "resourcepool",
        method: "delete",
      },
    });
  });

  it("disables the delete button for default pools", () => {
    const store = mockStore(state);
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 0,
        name: "default",
        description: "default",
        is_default: true,
        permissions: ["edit", "delete"],
      }),
    ];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Button").at(1).props().disabled).toBe(true);
  });

  it("disables the delete button for pools that contain machines", () => {
    const store = mockStore(state);
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 0,
        name: "machines",
        description: "has machines",
        is_default: false,
        permissions: ["edit", "delete"],
        machine_total_count: 1,
      }),
    ];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Button").at(1).props().disabled).toBe(true);
  });

  it("does not show a machine link for empty pools", () => {
    state.resourcepool.items[0].machine_total_count = 0;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    const name = wrapper.find("TableRow").at(1).find("TableCell").at(1);
    expect(name.text()).toBe("Empty pool");
  });

  it("can show a machine link for non-empty pools", () => {
    state.resourcepool.items[0].machine_total_count = 5;
    state.resourcepool.items[0].machine_ready_count = 1;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    const link = wrapper
      .find("TableRow")
      .at(1)
      .find("TableCell")
      .at(1)
      .find("Link");
    expect(link.exists()).toBe(true);
    expect(link.prop("to")).toBe("/machines?pool=%3Ddefault");
    expect(link.text()).toBe("1 of 5 ready");
  });

  it("displays state errors in a notification", () => {
    state.resourcepool.errors = "Pools are not for swimming.";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Pools />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification p").text()).toEqual(
      "Pools are not for swimming."
    );
  });
});
