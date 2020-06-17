import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import TypeColumn from "./TypeColumn";

const mockStore = configureStore();

describe("TypeColumn", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        items: [
          {
            id: 1,
            name: "pod-1",
            type: "virsh",
          },
        ],
      },
    };
  });

  it("displays the formatted pod type", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <TypeColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-type']").text()).toBe("Virsh");
  });
});
