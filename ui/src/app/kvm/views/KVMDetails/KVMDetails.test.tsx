import React from "react";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import KVMDetails from "./KVMDetails";

const mockStore = configureStore();

describe("KVMDetails", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [],
      },
      messages: {
        items: [],
      },
      notification: {
        items: [],
      },
      pod: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            id: 1,
            name: "pod-1",
            composed_machines_count: 10,
          },
        ],
      },
    };
  });

  it("redirects to KVM list if pods have loaded but pod is not in state", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/2", key: "testKey" }]}>
          <KVMDetails />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
    expect(wrapper.find("Redirect").props().to).toBe("/kvm");
  });
});
