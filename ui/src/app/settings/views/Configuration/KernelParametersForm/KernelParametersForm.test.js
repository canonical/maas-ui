import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import KernelParametersForm from "./KernelParametersForm";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KernelParametersForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: "kernel_opts",
            value: "foo",
          },
        ],
      }),
    });
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
      wrapper.find("input[name='kernel_opts']").first().props().value
    ).toBe("foo");
  });
});
