import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import AddMachine from "./AddMachine";

const mockStore = configureStore();

describe("AddMachine", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: []
      },
      domain: {
        items: [],
        loaded: true,
        loading: false
      },
      general: {
        architectures: {
          data: [],
          loaded: true,
          loading: false
        },
        defaultMinHweKernel: {
          data: "",
          loaded: true,
          loading: false
        },
        hweKernels: {
          data: [],
          loaded: true,
          loading: false
        },
        powerTypes: {
          data: [],
          loaded: true,
          loading: false
        }
      },
      resourcepool: {
        items: [],
        loaded: true,
        loading: false
      },
      zone: {
        items: [],
        loaded: true,
        loading: false
      }
    };
  });

  it("fetches the necessary data on load if not already loaded", () => {
    const state = { ...initialState };
    state.resourcepool.loaded = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachine />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "FETCH_DOMAIN",
      "FETCH_GENERAL_ARCHITECTURES",
      "FETCH_GENERAL_DEFAULT_MIN_HWE_KERNEL",
      "FETCH_GENERAL_HWE_KERNELS",
      "FETCH_GENERAL_POWER_TYPES",
      "FETCH_RESOURCEPOOL",
      "FETCH_ZONE"
    ];
    const actions = store.getActions();
    expectedActions.forEach(expectedAction => {
      expect(actions.some(action => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = { ...initialState };
    state.resourcepool.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddMachine />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").length).toBe(1);
  });
});
