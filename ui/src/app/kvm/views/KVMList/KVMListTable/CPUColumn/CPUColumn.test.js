import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import CPUColumn from "./CPUColumn";

const mockStore = configureStore();

describe("CPUColumn", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        items: [
          {
            cpu_over_commit_ratio: 1,
            id: 1,
            name: "pod-1",
            total: {
              cores: 8,
            },
            used: {
              cores: 4,
            },
          },
        ],
      },
    };
  });

  it("can display total cores without overcommit", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CPUColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__labels").text()).toBe("8");
    expect(wrapper.find("Meter").props().max).toBe(8);
  });

  it("can display total cores with overcommit", () => {
    const state = { ...initialState };
    state.pod.items[0].cpu_over_commit_ratio = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CPUColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__labels").text()).toBe("8");
    expect(wrapper.find("Meter").props().max).toBe(16);
  });
});
