import { shallow, mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMWareForm from "./VMWareForm";

const mockStore = configureStore();

describe("VMWareForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "vcenter_server",
            value: "my server"
          },
          {
            name: "vcenter_username",
            value: "admin"
          },
          {
            name: "vcenter_password",
            value: "passwd"
          },
          {
            name: "vcenter_datacenter",
            value: "my datacenter"
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
        <VMWareForm />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("sets vcenter_server value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(
      wrapper
        .find("[name='vcenter_server']")
        .first()
        .props().value
    ).toBe("my server");
  });

  it("sets vcenter_username value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(
      wrapper
        .find("[name='vcenter_username']")
        .first()
        .props().value
    ).toBe("admin");
  });

  it("sets vcenter_password value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(
      wrapper
        .find("[name='vcenter_password']")
        .first()
        .props().value
    ).toBe("passwd");
  });

  it("sets vcenter_datacenter value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWareForm />
      </Provider>
    );
    expect(
      wrapper
        .find("[name='vcenter_datacenter']")
        .first()
        .props().value
    ).toBe("my datacenter");
  });
});
