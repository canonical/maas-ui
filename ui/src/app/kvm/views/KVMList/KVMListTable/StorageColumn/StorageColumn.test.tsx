import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import StorageColumn from "./StorageColumn";

const mockStore = configureStore();

describe("StorageColumn", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        items: [
          {
            id: 1,
            name: "pod-1",
            total: {
              local_storage: 1000000000000,
            },
            used: {
              local_storage: 100000000000,
            },
          },
        ],
      },
    };
  });

  it("can display correct storage information", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <StorageColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__labels").text()).toBe(
      "0.1 of 1 TB assigned"
    );
    expect(wrapper.find("Meter").props().max).toBe(1000000000000);
  });
});
