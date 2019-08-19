import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { UserFormFields } from "./UserFormFields";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

describe("UserFormFields", () => {
  let formikProps, state;

  beforeEach(() => {
    formikProps = {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setStatus: jest.fn(),
      touched: {},
      values: {}
    };
    state = {
      users: {
        errors: {},
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false
      }
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UserFormFields formikProps={formikProps} />
      </Provider>
    );
    expect(wrapper.find("UserFormFields")).toMatchSnapshot();
  });

  it("hides the password fields when editing", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UserFormFields formikProps={formikProps} editing={true} />
      </Provider>
    );
    expect(
      wrapper
        .find("Link")
        .first()
        .children()
        .text()
    ).toEqual("Change password…");
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(0);
  });

  it("can toggle the password fields", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UserFormFields formikProps={formikProps} editing={true} />
      </Provider>
    );
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(0);
    wrapper.find("Link").simulate("click", { preventDefault: jest.fn() });
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(2);
  });

  it("can set error status", () => {
    state.users.errors = {
      username: ["Username already exists"]
    };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <UserFormFields formikProps={formikProps} />
      </Provider>
    );
    expect(formikProps.setStatus).toHaveBeenCalled();
  });
});
