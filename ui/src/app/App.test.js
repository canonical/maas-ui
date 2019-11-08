import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { App } from "./App";

const mockStore = configureStore();

describe("App", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [{ name: "completed_intro", value: true }]
      },
      general: {
        architectures: {
          data: [],
          errors: {},
          loaded: false,
          loading: false
        },
        componentsToDisable: {
          data: [],
          errors: {},
          loaded: false,
          loading: false
        },
        defaultMinHweKernel: {
          data: "",
          errors: {},
          loaded: false,
          loading: false
        },
        hweKernels: {
          data: [],
          errors: {},
          loaded: false,
          loading: false
        },
        knownArchitectures: {
          data: [],
          errors: {},
          loaded: false,
          loading: false
        },
        machineActions: {
          data: [],
          errors: {},
          loaded: false,
          loading: false
        },
        navigationOptions: {
          data: {},
          errors: {},
          loaded: false,
          loading: false
        },
        osInfo: {
          data: {},
          errors: {},
          loaded: false,
          loading: false
        },
        pocketsToDisable: {
          data: [],
          errors: {},
          loaded: false,
          loading: false
        },
        powerTypes: {
          data: [],
          errors: {},
          loaded: false,
          loading: false
        },
        version: {
          data: "",
          errors: {},
          loaded: false,
          loading: false
        }
      },
      machine: {
        errors: {},
        items: [],
        loaded: false,
        loading: false
      },
      messages: {
        items: []
      },
      status: {},
      user: {
        auth: {
          loading: false,
          user: {
            completed_intro: true,
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

  it("renders routes if logged in", () => {
    state.status.connected = true;
    state.status.authenticated = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Routes").exists()).toBe(true);
  });

  it("displays connection errors", () => {
    state.status.error = "Error!";
    state.status.authenticated = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toBe("Failed to connect.");
  });

  it("displays a loading message if connecting", () => {
    state.status.connecting = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("displays a loading message when authenticating", () => {
    state.status.authenticating = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("displays a loading message if fetching auth user", () => {
    state.user.auth.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("connects to the WebSocket", () => {
    state.status.authenticated = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some(action => action.type === "WEBSOCKET_CONNECT")
    ).toBe(true);
  });

  it("fetches the auth user when connected", () => {
    state.status.connected = true;
    state.status.authenticated = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some(action => action.type === "FETCH_AUTH_USER")
    ).toBe(true);
  });

  it("shows a login screen when logged out", () => {
    state.status.authenticated = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Login").exists()).toBe(true);
  });

  it("can show the RSD link", () => {
    state.general.navigationOptions.data.rsd = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Header").prop("showRSD")).toBe(true);
  });
});
