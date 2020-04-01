import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import AddChassisForm from "../AddChassisForm";

const mockStore = configureStore();

describe("AddChassisFormFields", () => {
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

  it("can render", () => {
    const state = { ...initialState };
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
    expect(wrapper.find("AddChassisFormFields").exists()).toBe(true);
  });
});
