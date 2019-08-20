import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";
import UsersList from "./UsersList";

const mockStore = configureStore();

describe("UsersList", () => {
  let defaultStore, users;

  beforeEach(() => {
    users = [
      {
        email: "admin@example.com",
        first_name: "",
        global_permissions: ["machine_create"],
        id: 1,
        is_superuser: true,
        last_name: "",
        sshkeys_count: 0,
        username: "admin"
      },
      {
        email: "user@example.com",
        first_name: "",
        global_permissions: ["machine_create"],
        id: 2,
        is_superuser: false,
        last_name: "",
        sshkeys_count: 0,
        username: "user1"
      }
    ];
    defaultStore = {
      auth: {
        user: users[0]
      },
      users: {
        loading: false,
        loaded: true,
        items: users
      }
    };
  });

  it("displays a loading component if loading", () => {
    defaultStore.users.loading = true;
    const store = mockStore(defaultStore);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("hides the table if no users have loaded", () => {
    defaultStore.users.loaded = false;
    const store = mockStore(defaultStore);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(false);
  });

  it("shows the table if there are users", () => {
    const store = mockStore(defaultStore);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("can show a delete confirmation", () => {
    const store = mockStore(defaultStore);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("MainTable").prop("rows")[1];
    expect(row.expanded).toBe(false);
    // Click on the delete button:
    wrapper
      .find("TableRow")
      .at(2)
      .find("Button")
      .at(1)
      .simulate("click");
    row = wrapper.find("MainTable").prop("rows")[1];
    expect(row.expanded).toBe(true);
  });

  it("can filter users", () => {
    const store = mockStore(defaultStore);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    let rows = wrapper.find("MainTable").prop("rows");
    expect(rows.length).toBe(2);
    act(() =>
      wrapper
        .find("SearchBox")
        .props()
        .onChange("admin")
    );
    wrapper.update();
    rows = wrapper.find("MainTable").prop("rows");
    expect(rows.length).toBe(1);
  });
});
