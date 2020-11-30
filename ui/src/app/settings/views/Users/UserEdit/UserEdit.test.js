import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route } from "react-router-dom";

import { UserEdit } from "./UserEdit";

const mockStore = configureStore();

describe("UserEdit", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      status: {},
      user: {
        auth: {},
        errors: {},
        loaded: true,
        loading: false,
        items: [
          {
            email: "admin@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 0,
            username: "admin",
          },
          {
            email: "user@example.com",
            global_permissions: ["machine_create"],
            id: 2,
            is_superuser: false,
            last_name: "",
            sshkeys_count: 0,
            username: "user1",
          },
        ],
      },
    };
  });

  it("displays a loading component if loading", () => {
    state.user.loading = true;
    state.user.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
        >
          <UserEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("handles user not found", () => {
    state.user.items = [];
    const store = mockStore(state);
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/users/1/edit", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/settings/users/:id/edit"
            component={(props) => <UserEdit {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("UserForm").at(0);
    expect(form.exists()).toBe(true);
    expect(form.prop("user")).toStrictEqual(state.user.items[0]);
  });
});
