import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route } from "react-router-dom";

import { APIKeyEdit } from "./APIKeyEdit";

const mockStore = configureStore();

describe("APIKeyEdit", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      token: {
        loading: false,
        loaded: true,
        items: [{ id: 1, key: "ssh-rsa aabb", consumer: {} }],
      },
    };
  });

  it("displays a loading component if loading", () => {
    state.token.loading = true;
    state.token.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/api-keys/1", key: "testKey" },
          ]}
        >
          <APIKeyEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("handles api key not found", () => {
    state.token.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/api-keys/1", key: "testKey" },
          ]}
        >
          <APIKeyEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("h4").text()).toBe("API key not found");
  });

  it("can display an api key edit form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/api-keys/1/edit", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/account/prefs/api-keys/:id/edit"
            component={(props) => <APIKeyEdit {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("APIKeyForm").at(0);
    expect(form.exists()).toBe(true);
    expect(form.prop("token")).toStrictEqual(state.token.items[0]);
  });
});
