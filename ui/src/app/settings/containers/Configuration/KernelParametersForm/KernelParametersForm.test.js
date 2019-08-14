import { shallow, mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import KernelParametersForm from "./KernelParametersForm";

const mockStore = configureStore();

describe("KernelParametersForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "kernel_opts",
            value: "foo"
          }
        ]
      }
    };
  });

  it("sets kernel_opts value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <KernelParametersForm />
      </Provider>
    );
    expect(
      wrapper
        .find("[name='kernel_opts']")
        .first()
        .props().value
    ).toBe("foo");
  });
});
