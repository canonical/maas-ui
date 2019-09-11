import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import { DhcpFormFields } from "./DhcpFormFields";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

describe("DhcpFormFields", () => {
  let formikProps, state;

  beforeEach(() => {
    formikProps = {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFieldTouched: jest.fn(),
      setFieldValue: jest.fn(),
      setStatus: jest.fn(),
      touched: {},
      values: {
        enabled: false,
        name: "lease",
        value: "lease 10"
      }
    };
    state = {
      controller: { items: [], loaded: true },
      device: { items: [], loaded: true },
      dhcpsnippet: {
        errors: {},
        items: [
          {
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 1,
            name: "lease",
            updated: "Thu, 15 Aug. 2019 06:21:39",
            value: "lease 10"
          },
          {
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 2,
            name: "class",
            updated: "Thu, 15 Aug. 2019 06:21:39"
          }
        ],
        loaded: true,
        loading: false,
        saved: false,
        saving: false
      },
      machine: { items: [], loaded: true },
      subnet: {
        items: [
          {
            id: 1,
            name: "test.local"
          }
        ],
        loaded: true
      }
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DhcpFormFields").exists()).toBe(true);
  });

  it("can set error status", () => {
    state.dhcpsnippet.errors = {
      name: ["Name not provided"]
    };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(formikProps.setStatus).toHaveBeenCalled();
  });

  it("shows a notification if editing and disabled", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpFormFields formikProps={formikProps} editing />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
  });

  it("shows a loader if the models have not loaded", () => {
    state.subnet.loading = true;
    state.device.loading = true;
    state.controller.loading = true;
    state.machine.loading = true;
    state.subnet.loaded = false;
    state.device.loaded = false;
    state.controller.loaded = false;
    state.machine.loaded = false;
    formikProps.values.type = "subnet";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpFormFields formikProps={formikProps} editing />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
    expect(
      wrapper
        .findWhere(
          n => n.name() === "FormikField" && n.prop("fieldKey") === "entity"
        )
        .exists()
    ).toBe(false);
  });

  it("shows the entity options for a chosen type", () => {
    formikProps.values.type = "subnet";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpFormFields formikProps={formikProps} editing />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(false);
    expect(
      wrapper
        .findWhere(
          n => n.name() === "FormikField" && n.prop("fieldKey") === "entity"
        )
        .exists()
    ).toBe(true);
  });

  it("resets the entity if the type changes", () => {
    formikProps.values.type = "subnet";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DhcpFormFields formikProps={formikProps} editing />
        </MemoryRouter>
      </Provider>
    );
    const typeSelect = wrapper
      .findWhere(
        n => n.name() === "FormikField" && n.prop("fieldKey") === "type"
      )
      .find("select");
    typeSelect.value = "subnet";
    typeSelect.simulate("change");
    expect(formikProps.setFieldValue).toHaveBeenCalled();
    expect(formikProps.setFieldValue.mock.calls[0]).toEqual(["entity", ""]);
  });
});
