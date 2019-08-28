import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { Main } from "./Main";

const mockStore = configureStore();

describe("Main", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {},
      messages: {
        items: []
      },
      user: {
        auth: {
          loading: false,
          user: {
            email: "test@example.com",
            first_name: "",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 0,
            username: "admin"
          }
        }
      }
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Header").exists()).toBe(true);
    expect(wrapper.find("Routes").exists()).toBe(true);
  });

  it("displays a message when logged out", () => {
    state.user.auth.user = null;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toBe(
      "You are not authenticated. Please log in to MAAS."
    );
  });

  it("displays a loading message", () => {
    state.user.auth.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toBe("Loading…");
  });

  it("displays a message if not an admin", () => {
    state.user.auth.user.is_superuser = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toEqual(
      "You do not have permission to view this page."
    );
  });
});
