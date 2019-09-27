import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import SSLKeyList from "./SSLKeyList";

const mockStore = configureStore();

describe("SSLKeyList", () => {
  let state;

  beforeEach(() => {
    state = {
      sslkey: {
        loading: false,
        loaded: true,
        items: [
          {
            id: 1,
            key: "ssh-rsa aabb",
            keysource: { protocol: "lp", auth_id: "koalaparty" }
          },
          {
            id: 2,
            key: "ssh-rsa ccdd",
            keysource: { protocol: "gh", auth_id: "koalaparty" }
          },
          {
            id: 3,
            key: "ssh-rsa eeff",
            keysource: { protocol: "lp", auth_id: "maaate" }
          },
          {
            id: 4,
            key: "ssh-rsa gghh",
            keysource: { protocol: "gh", auth_id: "koalaparty" }
          },
          { id: 5, key: "ssh-rsa gghh" }
        ]
      }
    };
  });

  it("displays a loading component if machines are loading", () => {
    state.sslkey.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" }
          ]}
        >
          <SSLKeyList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("can display errors", () => {
    state.sslkey.errors = "Unable to list SSL keys.";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" }
          ]}
        >
          <SSLKeyList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").text()).toEqual(
      "Error:Unable to list SSL keys."
    );
  });

  it("can render the table", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" }
          ]}
        >
          <SSLKeyList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });
});
