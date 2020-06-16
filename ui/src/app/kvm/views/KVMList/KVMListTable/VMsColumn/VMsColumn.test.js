import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import VMsColumn from "./VMsColumn";

const mockStore = configureStore();

describe("VMsColumn", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        items: [
          {
            composed_machines_count: 10,
            id: 1,
            name: "pod-1",
            owners_count: 5,
          },
        ],
      },
    };
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
