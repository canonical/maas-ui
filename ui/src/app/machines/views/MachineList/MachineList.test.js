import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import MachineList from "./MachineList";

const mockStore = configureStore();

describe("MachineList", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: []
      }
    };
  });

  it("displays a loading component if machines are loading", () => {
    const state = { ...initialState };
    state.machine.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });
});
