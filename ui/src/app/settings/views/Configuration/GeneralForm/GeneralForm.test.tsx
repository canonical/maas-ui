import React from "react";

import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import GeneralForm from "./GeneralForm";

import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("GeneralForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: "maas_name", value: "bionic-maas" }),
          configFactory({ name: "enable_analytics", value: true }),
          configFactory({ name: "release_notifications", value: true }),
        ],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);

    const wrapper = shallow(
      <Provider store={store}>
        <GeneralForm />
      </Provider>
    );
    expect(wrapper.find("GeneralForm").exists()).toBe(true);
  });

  it("sets maas_name value", () => {
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

  it("sets release_notifications value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <GeneralForm />
      </Provider>
    );
    expect(
      wrapper.find("input[name='release_notifications']").props().value
    ).toBe(true);
  });

  it("can trigger usabilla when the notifications are turned off", () => {
    const store = mockStore(state);
    window.usabilla_live = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <GeneralForm />
      </Provider>
    );
    wrapper.find("Formik").props().onSubmit(
      {
        enable_analytics: true,
        release_notifications: false,
      },
      { resetForm: jest.fn() }
    );
    expect(window.usabilla_live).toHaveBeenCalled();
  });
});
