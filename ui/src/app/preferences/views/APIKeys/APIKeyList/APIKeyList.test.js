import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import APIKeyList from "./APIKeyList";

const mockStore = configureStore();

describe("APIKeyList", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      token: {
        loading: false,
        loaded: true,
        items: [
          { id: 1, key: "ssh-rsa aabb", consumer: {} },
          { id: 2, key: "ssh-rsa ccdd", consumer: {} },
        ],
      },
    };
  });

  it("can render the table", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/api-keys", key: "testKey" },
          ]}
        >
          <APIKeyList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });
});
