import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import Machines from "./Machines";

const mockStore = configureStore();

describe("Machines", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: []
      },
      messages: {
        items: []
      },
      machine: {
        loaded: false,
        items: [1, 2]
      }
    };
  });

  it("displays a loader if machines have not loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("displays a machine count if machines have loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="machine-count"]').text()).toBe(
      "2 machines available"
    );
  });
});
