import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import StorageFormFields from "./StorageFormFields";

const mockStore = configureStore();

describe("StorageFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    default_storage_layout: "bcache",
    enable_disk_erasing_on_release: false,
    disk_erase_with_secure_erase: false,
    disk_erase_with_quick_erase: false
  };

  beforeEach(() => {
    baseFormikProps = {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      initialValues: { ...baseValues },
      touched: {},
      values: { ...baseValues }
    };
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
          }
        ]
      }
    };
  });

  it("displays a warning if blank storage layout chosen", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.default_storage_layout = "blank";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <StorageFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      "Caution: You will not be able to deploy machines with this storage layout. Manual configuration is required."
    );
  });

  it("displays a warning if vmfs6 storage layout chosen", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.default_storage_layout = "vmfs6";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <StorageFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      "Caution: The VMFS6 storage layout only allows for the deployment of VMware (ESXi)."
    );
  });

  it("correctly reflects enableDiskErasing state", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.enable_disk_erasing_on_release = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <StorageFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper.find("Input[name='enable_disk_erasing_on_release']").props()
        .checked
    ).toBe(true);
  });

  it("correctly reflects diskEraseWithSecure state", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.disk_erase_with_secure_erase = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <StorageFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper.find("Input[name='disk_erase_with_secure_erase']").props().checked
    ).toBe(true);
  });

  it("correctly reflects diskEraseWithQuick state", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.disk_erase_with_quick_erase = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <StorageFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper.find("Input[name='disk_erase_with_quick_erase']").props().checked
    ).toBe(true);
  });
});
