import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Users from "./Users";

const mockStore = configureStore();

describe("Users", () => {
  it("can render", () => {
    const user = {
      email: "test@example.com",
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
        items: [
          {
            user
          }
        ]
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
    expect(wrapper).toMatchSnapshot();
  });
});
