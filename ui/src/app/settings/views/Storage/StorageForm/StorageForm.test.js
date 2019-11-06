import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import StorageForm from "./StorageForm";

const mockStore = configureStore();

describe("StorageForm", () => {
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

  it("dispatches an action to update config on save button click", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <StorageForm />
      </Provider>
    );
    wrapper
      .find("Formik")
      .props()
      .onSubmit(
        {
          default_storage_layout: "bcache",
          disk_erase_with_quick_erase: false,
          disk_erase_with_secure_erase: false,
          enable_disk_erasing_on_release: false
        },
        { resetForm: jest.fn() }
      );

    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_CONFIG",
        payload: {
          params: [
            { name: "default_storage_layout", value: "bcache" },
            { name: "disk_erase_with_quick_erase", value: false },
            { name: "disk_erase_with_secure_erase", value: false },
            { name: "enable_disk_erasing_on_release", value: false }
          ]
        },
        meta: {
          model: "config",
          method: "update"
        }
      }
    ]);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <StorageForm />
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter(action => action.type.startsWith("FETCH"));

    expect(fetchActions).toEqual([
      {
        type: "FETCH_CONFIG",
        meta: {
          model: "config",
          method: "list"
        }
      }
    ]);
  });
});
