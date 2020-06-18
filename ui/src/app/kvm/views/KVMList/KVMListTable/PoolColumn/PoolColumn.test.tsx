import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import PoolColumn from "./PoolColumn";

const mockStore = configureStore();

describe("PoolColumn", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        items: [
          {
            id: 1,
            name: "pod-1",
            pool: 1,
            zone: 1,
          },
        ],
      },
      resourcepool: {
        items: [
          {
            id: 1,
            name: "swimming-pool",
          },
        ],
      },
      zone: {
        items: [
          {
            id: 1,
            name: "alone-zone",
          },
        ],
      },
    };
  });

  it("can display the pod's resource pool and zone", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PoolColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-pool']").text()).toBe("swimming-pool");
    expect(wrapper.find("[data-test='pod-zone']").text()).toBe("alone-zone");
  });
});
