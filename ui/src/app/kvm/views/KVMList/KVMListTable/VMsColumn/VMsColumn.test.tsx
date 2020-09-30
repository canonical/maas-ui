import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import VMsColumn from "./VMsColumn";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("VMsColumn", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            composed_machines_count: 10,
            owners_count: 5,
          }),
        ],
      }),
    });
  });

  it("displays the pod's machine and owner counts", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-machines-count']").text()).toBe("10");
    expect(wrapper.find("[data-test='pod-owners-count']").text()).toBe("5");
  });
});
