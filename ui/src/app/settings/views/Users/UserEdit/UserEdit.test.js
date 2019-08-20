import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route } from "react-router-dom";

import { UserEdit } from "./UserEdit";

const mockStore = configureStore();

describe("UserEdit", () => {
  let users;

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
  });

  it("displays a loading component if loading", () => {
    const store = mockStore({
      user: {
        errors: {},
        loading: true,
        items: users
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
        >
          <UserEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("handles user not found", () => {
    const store = mockStore({
      user: {
        errors: {},
        loading: false,
        loaded: true,
        items: []
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
        >
          <UserEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("h4").text()).toBe("User not found");
  });

  it("can display a user edit form", () => {
    const store = mockStore({
      user: {
        errors: {},
        loading: false,
        loaded: true,
        items: users
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/users/1/edit", key: "testKey" }
          ]}
        >
          <Route
            exact
            path="/settings/users/:id/edit"
            component={props => <UserEdit {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("UserForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("user")).toStrictEqual(users[0]);
  });
});
