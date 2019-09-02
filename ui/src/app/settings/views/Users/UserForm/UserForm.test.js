import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { UserForm } from "./UserForm";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

describe("UserForm", () => {
  let state;

  beforeEach(() => {
    state = {
      user: {
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
        <UserForm title="Add user" />
      </Provider>
    );
    expect(wrapper.find("UserForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UserForm title="Add user" />
      </Provider>
    );
    wrapper.unmount();
    expect(store.getActions()).toEqual([
      {
        type: "CLEANUP_USER"
      }
    ]);
  });

  it("redirects when the user is saved", () => {
    state.user.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm title="Add user" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can update a user", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UserForm
          title="Add user"
          user={{
            email: "old@example.com",
            first_name: "Miss",
            id: 808,
            is_superuser: true,
            last_name: "Wallaby",
            password1: "test1234",
            password2: "test1234",
            username: "admin"
          }}
        />
      </Provider>
    );
    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin"
        })
    );
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_USER",
        payload: {
          params: {
            email: "test@example.com",
            first_name: "Miss",
            id: 808,
            is_superuser: true,
            last_name: "Wallaby",
            password1: "test1234",
            password2: "test1234",
            username: "admin"
          }
        },
        meta: {
          model: "user",
          method: "update"
        }
      }
    ]);
  });

  it("can create a user", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UserForm title="Add user" />
      </Provider>
    );
    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin"
        })
    );
    expect(store.getActions()).toEqual([
      {
        type: "CREATE_USER",
        payload: {
          params: {
            email: "test@example.com",
            first_name: "Miss",
            is_superuser: true,
            last_name: "Wallaby",
            password1: "test1234",
            password2: "test1234",
            username: "admin"
          }
        },
        meta: {
          model: "user",
          method: "create"
        }
      }
    ]);
  });

  it("adds a message when a user is added", () => {
    state.user.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm title="Add user" />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some(action => action.type === "CLEANUP_USER")).toBe(true);
    expect(actions.some(action => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
