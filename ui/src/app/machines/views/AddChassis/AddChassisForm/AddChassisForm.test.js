import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import AddChassisForm from "./AddChassisForm";

const mockStore = configureStore();

describe("AddChassisForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [{ name: "maas_name", value: "MAAS" }],
      },
      domain: {
        items: [
          {
            id: 0,
            name: "maas",
          },
        ],
        loaded: true,
      },
      general: {
        powerTypes: {
          data: [
            {
              name: "manual",
              description: "Manual",
              fields: [],
              chassis: true,
            },
            {
              name: "dummy",
              description: "Dummy power type",
              fields: [
                {
                  name: "power_address",
                  label: "IP address",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
              ],
              chassis: true,
            },
          ],
          loaded: true,
        },
      },
      machine: {
        errors: {},
        saved: false,
        saving: false,
      },
    };
  });

  it("fetches the necessary data on load if not already loaded", () => {
    const state = { ...initialState };
    state.domain.loaded = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <AddChassisForm />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["FETCH_DOMAIN", "FETCH_GENERAL_POWER_TYPES"];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = { ...initialState };
    state.domain.loaded = false;
    state.general.powerTypes.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <AddChassisForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });
});
