import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import DeprecationNotices from "./DeprecationNotices";

const mockStore = configureStore();

describe("DeprecationNotices", () => {
  let state;

  beforeEach(() => {
    state = {
      general: {
        deprecationNotices: {
          data: [],
          loaded: true,
          loading: false,
        },
        version: {
          data: "2.8.0",
          loaded: true,
          loading: false,
        },
      },
    };
  });

  it("fetches data for deprecation notices and version", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <DeprecationNotices />
      </Provider>
    );

    expect(
      store
        .getActions()
        .some((action) => action.type === "FETCH_GENERAL_VERSION")
    ).toBe(true);
    expect(
      store
        .getActions()
        .some((action) => action.type === "FETCH_GENERAL_DEPRECATION_NOTICES")
    ).toBe(true);
  });

  it("can display deprecation notices with a link", () => {
    state.general = {
      deprecationNotices: {
        data: [
          {
            id: 1,
            description: "Deprecated",
            "link-text": "Click here to find out why",
            since: "2.8",
            url: "www.url.com",
          },
        ],
        loaded: true,
        loading: false,
      },
      version: {
        data: "2.8.0",
        loaded: true,
        loading: false,
      },
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeprecationNotices />
      </Provider>
    );

    expect(wrapper.find("[data-test='deprecation-1']").exists()).toBe(true);
    expect(wrapper.find("[data-test='deprecation-1'] a").props().href).toBe(
      "www.url.com"
    );
    expect(wrapper.find("[data-test='deprecation-1'] a").text()).toBe(
      "Click here to find out why..."
    );
  });

  it("does not display deprecation notices if version is too old", () => {
    state.general = {
      deprecationNotices: {
        data: [
          {
            id: 1,
            description: "Deprecated",
            since: "2.9",
            url: "www.url.com",
          },
        ],
        loaded: true,
        loading: false,
      },
      version: {
        data: "2.8.0",
        loaded: true,
        loading: false,
      },
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeprecationNotices />
      </Provider>
    );

    expect(wrapper.find("[data-test='deprecation-1']").exists()).toBe(false);
  });
});
