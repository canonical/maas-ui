import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { PoolAdd } from "./PoolAdd";

const mockStore = configureStore();

describe("PoolAdd", () => {
  let state;
  beforeEach(() => {
   state = {
      config: {
        items: []
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: []
      },
      resourcepool: {
        loaded: true,
        saved: false,
        items: []
      }
    }
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/pool/add", key: "testKey" }]}
        >
          <PoolAdd />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("PoolAdd").exists()).toBe(true);
  });
});
