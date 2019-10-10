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
      config: {},
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
      status: {
        connected: true
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
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("App").exists()).toBe(true);
  });

  it("displays connection errors", () => {
    state.status.error = "Error!";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toBe("Failed to connect.");
  });

  it("displays a loading message if not connected", () => {
    state.status.connected = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
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
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("connects to the WebSocket", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some(action => action.type === "WEBSOCKET_CONNECT")
    ).toBe(true);
  });

  it("fetches the auth user when connected", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some(action => action.type === "WEBSOCKET_CONNECT")
    ).toBe(true);
  });

  it("displays a message when logged out", () => {
    state.user.auth.user = null;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toBe(
      "You are not authenticated. Please log in to MAAS."
    );
  });

  it("displays a message if not an admin", () => {
    state.user.auth.user.is_superuser = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toEqual(
      "You do not have permission to view this page."
    );
  });
});
