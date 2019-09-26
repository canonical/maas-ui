import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import SSHKeyList from "./SSHKeyList";

const mockStore = configureStore();

describe("SSHKeyList", () => {
  let state;

  beforeEach(() => {
    state = {
      sshkey: {
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
    state.sshkey.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssh-keys", key: "testKey" }
          ]}
        >
          <SSHKeyList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("can group keys", () => {
    state.sshkey.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssh-keys", key: "testKey" }
          ]}
        >
          <SSHKeyList />
        </MemoryRouter>
      </Provider>
    );
    const rows = wrapper.find("MainTable").prop("rows");
    // Two of the keys should be grouped together.
    expect(rows.length).toBe(state.sshkey.items.length - 1);
    // The count column should match the grouped keys.
    expect(rows[1].columns[2].content).toBe(2);
  });
});
