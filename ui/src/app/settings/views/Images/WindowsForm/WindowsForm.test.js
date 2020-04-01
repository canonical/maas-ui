import { shallow, mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import WindowsForm from "./WindowsForm";

const mockStore = configureStore();

describe("WindowsForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "windows_kms_host",
            value: "127.0.0.1",
          },
        ],
      },
    };
  });

  it("can render", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = shallow(
      <Provider store={store}>
        <WindowsForm />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("sets windows_kms_host value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <WindowsForm />
      </Provider>
    );
    expect(
      wrapper.find("input[name='windows_kms_host']").first().props().value
    ).toBe("127.0.0.1");
  });
});
