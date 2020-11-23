import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CPUColumn from "./CPUColumn";

import {
  pod as podFactory,
  podHint as podHintFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("CPUColumn", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            cpu_over_commit_ratio: 1,
            id: 1,
            name: "pod-1",
            total: podHintFactory({
              cores: 8,
            }),
            used: podHintFactory({
              cores: 4,
            }),
          }),
        ],
      }),
    });
  });

  it("can display correct cpu core information without overcommit", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CPUColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "4 of 8 allocated"
    );
    expect(wrapper.find("Meter").props().max).toBe(8);
  });

  it("can display correct cpu core information with overcommit", () => {
    const state = { ...initialState };
    state.pod.items[0].cpu_over_commit_ratio = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CPUColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "4 of 16 allocated"
    );
    expect(wrapper.find("Meter").props().max).toBe(16);
  });
});
