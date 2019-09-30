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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm
            onSave={onSave}
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
        </MemoryRouter>
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
    expect(onSave.mock.calls[0][0]).toEqual({
      email: "test@example.com",
      first_name: "Miss",
      id: 808,
      is_superuser: true,
      last_name: "Wallaby",
      password1: "test1234",
      password2: "test1234",
      username: "admin"
    });
  });
});
