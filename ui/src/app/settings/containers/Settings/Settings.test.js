import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Settings from "./Settings";

const mockStore = configureStore();

describe("Settings", () => {
  it("dispatches action to fetch config on load", () => {
    const store = mockStore({
      config: {
        loading: false,
        loaded: false,
        items: []
      }
    });

    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        >
          <Settings />
        </MemoryRouter>
      </Provider>
    );

    expect(store.getActions()).toEqual([
      {
        type: "FETCH_CONFIG",
        meta: {
          method: "config.list",
          type: 0
        }
      }
    ]);
  });
});
