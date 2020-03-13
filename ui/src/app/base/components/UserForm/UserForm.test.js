import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { UserForm } from "./UserForm";

const mockStore = configureStore();

describe("UserForm", () => {
  let state, user;

  beforeEach(() => {
    user = {
      email: "old@example.com",
      id: 808,
      is_superuser: true,
      last_name: "Miss Wallaby",
      password1: "test1234",
      password2: "test1234",
      username: "admin"
    };
    state = {
      status: {},
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
        <MemoryRouter initialEntries={["/"]}>
          <UserForm onSave={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("UserForm").exists()).toBe(true);
  });

  it("can handle saving", () => {
    const store = mockStore(state);
    const onSave = jest.fn();
    const resetForm = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm onSave={onSave} user={user} />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit(
          {
            isSuperuser: true,
            email: "test@example.com",
            fullName: "Miss Wallaby",
            password: "test1234",
            passwordConfirm: "test1234",
            username: "admin"
          },
          { resetForm }
        )
    );
    expect(onSave.mock.calls[0][0]).toEqual({
      email: "test@example.com",
      id: 808,
      is_superuser: true,
      last_name: "Miss Wallaby",
      password1: "test1234",
      password2: "test1234",
      username: "admin"
    });
    expect(resetForm).toHaveBeenCalled();
  });

  it("hides the password fields when editing", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm onSave={jest.fn()} user={user} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("Button")
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
          <UserForm onSave={jest.fn()} user={user} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(0);
    wrapper.find("Button").simulate("click");
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
          <UserForm includeCurrentPassword onSave={jest.fn()} user={user} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button").simulate("click");
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("name") === "old_password"
      ).length
    ).toEqual(1);
  });

  it("can include auth errors in the error status", () => {
    state.user.errors = {
      username: ["Username already exists"]
    };
    state.user.auth.errors = {
      password: ["Password too short"]
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm includeCurrentPassword onSave={jest.fn()} user={user} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikForm").prop("errors")).toEqual({
      username: ["Username already exists"],
      password: ["Password too short"]
    });
  });

  it("disables fields when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm onSave={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikField[disabled=true]").length).toEqual(
      wrapper.find("FormikField").length
    );
  });
});
