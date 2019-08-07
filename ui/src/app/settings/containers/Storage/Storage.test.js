import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

import { reduceInitialState } from "testing/utils";
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
            choices: [
              ["bcache", "Bcache layout"],
              ["blank", "No storage (blank) layout"],
              ["flat", "Flat layout"],
              ["lvm", "LVM layout"],
              ["vmfs6", "VMFS6 layout"]
            ]
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

  it("displays a loading component if loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/storage", key: "testKey" }]}
        >
          <Storage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("displays a warning if blank storage layout chosen", () => {
    const state = { ...initialState };
    const items = reduceInitialState(
      state.config.items,
      "name",
      "default_storage_layout",
      { value: "blank" }
    );
    state.config.items = items;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/storage", key: "testKey" }]}
        >
          <Storage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      "Caution: You will not be able to deploy machines with this storage layout. Manual configuration is required."
    );
  });

  it("displays a warning if vmfs6 storage layout chosen", () => {
    const state = { ...initialState };
    const items = reduceInitialState(
      state.config.items,
      "name",
      "default_storage_layout",
      { value: "vmfs6" }
    );
    state.config.items = items;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/storage", key: "testKey" }]}
        >
          <Storage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      "Caution: The VMFS6 storage layout only allows for the deployment of VMware (ESXi)."
    );
  });

  it("correctly reflects enableDiskErasing state", () => {
    const state = { ...initialState };
    const items = reduceInitialState(
      state.config.items,
      "name",
      "enable_disk_erasing_on_release",
      { value: true }
    );
    state.config.items = items;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/storage", key: "testKey" }]}
        >
          <Storage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Input#enableDiskErasing").props().checked).toBe(true);
  });

  it("correctly reflects diskEraseWithSecure state", () => {
    const state = { ...initialState };
    const items = reduceInitialState(
      state.config.items,
      "name",
      "disk_erase_with_secure_erase",
      { value: true }
    );
    state.config.items = items;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/storage", key: "testKey" }]}
        >
          <Storage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Input#diskEraseWithSecure").props().checked).toBe(
      true
    );
  });

  it("correctly reflects diskEraseWithQuick state", () => {
    const state = { ...initialState };
    const items = reduceInitialState(
      state.config.items,
      "name",
      "disk_erase_with_quick_erase",
      { value: true }
    );
    state.config.items = items;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/storage", key: "testKey" }]}
        >
          <Storage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Input#diskEraseWithQuick").props().checked).toBe(true);
  });
});
