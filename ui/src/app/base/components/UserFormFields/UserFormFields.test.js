import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

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
      user: {
        auth: {},
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
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("UserFormFields").exists()).toBe(true);
  });

  it("hides the password fields when editing", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserFormFields formikProps={formikProps} editing={true} />
        </MemoryRouter>
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
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserFormFields formikProps={formikProps} editing={true} />
        </MemoryRouter>
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

  it("can show the current password field", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserFormFields
            formikProps={formikProps}
            editing={true}
            includeCurrentPassword
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Link").simulate("click", { preventDefault: jest.fn() });
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("fieldKey") === "old_password"
      ).length
    ).toEqual(1);
  });

  it("can set error status", () => {
    state.user.errors = {
      username: ["Username already exists"]
    };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserFormFields formikProps={formikProps} />
        </MemoryRouter>
      </Provider>
    );
    expect(formikProps.setStatus).toHaveBeenCalled();
  });

  it("can include auth errors in the error status", () => {
    state.user.errors = {
      username: ["Username already exists"]
    };
    state.user.auth.errors = {
      password: ["Password too short"]
    };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserFormFields formikProps={formikProps} includeCurrentPassword />
        </MemoryRouter>
      </Provider>
    );
    expect(formikProps.setStatus.mock.calls[0][0].serverErrors).toEqual({
      username: "Username already exists",
      password: "Password too short"
    });
  });
});
