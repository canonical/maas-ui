import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Users from "./Users";

const mockStore = configureStore();

describe("Users", () => {
  it("displays a loading component if loading", () => {
    const user = {
      email: "admin@example.com",
      first_name: "",
      global_permissions: ["machine_create"],
      id: 1,
      is_superuser: true,
      last_name: "",
      sshkeys_count: 0,
      username: "admin"
    };
    const store = mockStore({
      auth: {
        user
      },
      users: {
        loading: true,
        items: []
      }
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <Users />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("hides the table if no users have loaded", () => {
    const user = {
      email: "admin@example.com",
      first_name: "",
      global_permissions: ["machine_create"],
      id: 1,
      is_superuser: true,
      last_name: "",
      sshkeys_count: 0,
      username: "admin"
    };
    const store = mockStore({
      auth: {
        user
      },
      users: {
        loading: false,
        items: []
      }
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <Users />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("MainTable").exists()).toBe(false);
  });
});
