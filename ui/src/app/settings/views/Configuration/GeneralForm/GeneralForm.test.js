import { shallow, mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import GeneralForm from "./GeneralForm";

const mockStore = configureStore();

describe("GeneralForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "maas_name",
            value: "bionic-maas"
          },
          {
            name: "enable_analytics",
            value: true
          }
        ]
      }
    };
  });

  it("can render", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = shallow(
      <Provider store={store}>
        <GeneralForm />
      </Provider>
    );
    expect(wrapper.find("GeneralForm").exists()).toBe(true);
  });

  it("sets maas_name value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <GeneralForm />
      </Provider>
    );
    expect(wrapper.find("input[name='maas_name']").props().value).toBe(
      "bionic-maas"
    );
  });

  it("sets enable_analytics value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <GeneralForm />
      </Provider>
    );
    expect(wrapper.find("input[name='enable_analytics']").props().value).toBe(
      true
    );
  });
});
