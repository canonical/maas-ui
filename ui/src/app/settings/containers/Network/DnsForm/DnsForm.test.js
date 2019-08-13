import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DnsForm from "./DnsForm";

const mockStore = configureStore();

describe("DnsForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "dnssec_validation",
            value: "auto",
            choices: [
              ["auto", "Automatic (use default root key)"],
              ["yes", "Yes (manually configured root key)"],
              [
                "no",
                "No (Disable DNSSEC; useful when upstream DNS is misconfigured)"
              ]
            ]
          },
          { name: "dns_trusted_acl", value: "" },
          { name: "upstream_dns", value: "" }
        ]
      }
    };
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DnsForm />
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("dispatches an action to update config on save button click", done => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DnsForm />
      </Provider>
    );
    wrapper.find("form").simulate("submit");

    // since Formik handler is evaluated asynchronously we have to delay checking the assertion
    window.setTimeout(() => {
      expect(store.getActions()).toEqual([
        {
          type: "UPDATE_CONFIG",
          payload: {
            params: [
              { name: "dnssec_validation", value: "auto" },
              { name: "dns_trusted_acl", value: "" },
              { name: "upstream_dns", value: "" }
            ]
          },
          meta: {
            method: "config.update",
            type: 0
          }
        }
      ]);
      done();
    }, 0);
  });
});
