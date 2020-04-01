import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { UserForm } from "./UserForm";

const mockStore = configureStore();

describe("UserForm", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      status: {},
      user: {
        auth: {},
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
          <UserForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("UserForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(store.getActions()).toEqual([
      {
        type: "CLEANUP_USER",
      },
    ]);
  });

  it("redirects when the user is saved", () => {
    state.user.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can update a user", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm
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
      wrapper.find("UserForm").at(1).props().onSave(
        {
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin",
        },
        {},
        true
      )
    );
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_USER",
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
      },
    ]);
  });

  it("can create a user", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("UserForm").at(1).props().onSave(
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
    expect(store.getActions()).toEqual([
      {
        type: "CREATE_USER",
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
          method: "create",
        },
      },
    ]);
  });

  it("adds a message when a user is added", () => {
    state.user.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "CLEANUP_USER")).toBe(true);
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });

  it("displays a checkbox for making the user a MAAS admin", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("FormikField[label='MAAS administrator']").exists()
    ).toBe(true);
  });
});
