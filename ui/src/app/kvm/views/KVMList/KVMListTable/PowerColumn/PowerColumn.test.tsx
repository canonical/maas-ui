import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import PowerColumn from "./PowerColumn";

const mockStore = configureStore();

describe("PowerColumn", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      controller: {
        loaded: true,
        loading: false,
        items: [],
      },
      machine: {
        loaded: true,
        loading: false,
        items: [],
      },
      pod: {
        items: [
          {
            id: 1,
            name: "pod-1",
          },
        ],
      },
    };
  });

  it(`shows a spinner if machines/controllers are loading and pod's host has not
    been found yet`, () => {
    const state = { ...initialState };
    state.machine.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerColumn id={1} />
      </Provider>
    );
    expect(wrapper.find(".p-icon--spinner").exists()).toBe(true);
  });

  it("can display the pod's host power information", () => {
    const state = { ...initialState };
    state.machine.items = [
      {
        power_state: "on",
        system_id: "abc123",
      },
    ];
    state.pod.items = [{ host: "abc123", id: 1, name: "pod-1" }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-power']").text()).toBe("On");
    expect(wrapper.find("i").props().className).toBe("p-icon--power-on");
  });

  it("displays 'Unknown' if pod's host cannot be found", () => {
    const state = { ...initialState };
    state.machine.items = [
      {
        power_state: "on",
        system_id: "abc123",
      },
    ];
    state.pod.items = [{ host: "def456", id: 1, name: "pod-1" }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-power']").text()).toBe("Unknown");
    expect(wrapper.find("i").props().className).toBe("p-icon--power-unknown");
  });
});
