import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Storage from "./Storage";

const mockStore = configureStore();

describe("Storage", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "default_storage_layout",
            value: "bcache",
            choices: []
          },
          {
            name: "enable_disk_erasing_on_release",
            value: false
          },
          {
            name: "disk_erase_with_secure_erase",
            value: false
          },
          {
            name: "disk_erase_with_quick_erase",
            value: false
          }
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
        <Storage />
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("displays the StorageForm if config is loaded", () => {
    const state = { ...initialState };
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Storage />
      </Provider>
    );

    expect(wrapper.find("StorageForm").exists()).toBe(true);
  });
});
