import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { Details } from "./Details";

const mockStore = configureStore();

describe("Details", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      status: {},
      user: {
        auth: {
          saved: false,
          user: {
            email: "test@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 0,
            username: "admin",
          },
        },
        errors: {},
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      },
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Details").exists()).toBe(true);
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "user/cleanup")).toBe(true);
    expect(actions.some((action) => action.type === "CLEANUP_AUTH_USER")).toBe(
      true
    );
  });

  it("can update the user", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details
            user={{
              email: "old@example.com",
              id: 808,
              is_superuser: true,
              last_name: "Miss Wallaby",
              password1: "test1234",
              password2: "test1234",
              username: "admin",
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("UserForm").props().onSave(
        {
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin",
        },
        {}
      )
    );
    expect(
      store.getActions().find(({ type }) => type === "user/update")
    ).toEqual({
      type: "user/update",
      payload: {
        params: {
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin",
        },
      },
      meta: {
        model: "user",
        method: "update",
      },
    });
  });

  it("can change the password", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details
            user={{
              email: "old@example.com",
              id: 808,
              is_superuser: true,
              last_name: "Miss Wallaby",
              password1: "test1234",
              password2: "test1234",
              username: "admin",
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("UserForm").props().onSave(
        {
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin",
        },
        {
          old_password: "test1",
          password: "test2",
          passwordConfirm: "test2",
        }
      )
    );
    const changePassword = store
      .getActions()
      .find((action) => action.type === "CHANGE_AUTH_USER_PASSWORD");
    expect(changePassword).toEqual({
      type: "CHANGE_AUTH_USER_PASSWORD",
      payload: {
        params: {
          old_password: "test1",
          new_password1: "test2",
          new_password2: "test2",
        },
      },
      meta: {
        model: "user",
        method: "change_password",
      },
    });
  });

  it("adds a message when a user is updated", () => {
    state.user.saved = true;
    state.user.auth.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });

  it("shows a message when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
  });
});
