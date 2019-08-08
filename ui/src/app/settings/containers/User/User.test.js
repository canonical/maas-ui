import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route } from "react-router-dom";

import User from "./User";

const mockStore = configureStore();

describe("User", () => {
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
      users: {
        loading: true,
        items: users
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
        >
          <User />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("handles user not found", () => {
    const store = mockStore({
      users: {
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
          <User />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("h4").text()).toBe("User not found");
  });

  it("can display a user", () => {
    const store = mockStore({
      users: {
        loading: false,
        loaded: true,
        items: users
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
        >
          <Route
            exact
            path="/settings/users/:id"
            component={props => <User {...props} />}
          />
          <User />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("User").first()).toMatchSnapshot();
  });

  it("can display a delete confirmation", () => {
    const store = mockStore({
      users: {
        loading: false,
        loaded: true,
        items: users
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
        >
          <Route
            exact
            path="/settings/users/:id"
            component={props => <User {...props} />}
          />
          <User />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Modal").exists()).toBe(false);
    wrapper
      .find("Button")
      .at(1)
      .simulate("click", {
        nativeEvent: { stopImmediatePropagation: jest.fn() }
      });
    expect(wrapper.find("Modal").exists()).toBe(true);
  });
});
