import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { Login } from "./Login";

const mockStore = configureStore();

describe("Login", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: []
      },
      status: {}
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Login").exists()).toBe(true);
  });

  it("can login", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          username: "koala",
          password: "gumtree"
        })
    );
    expect(
      store.getActions().find(action => action.type === "LOGIN")
    ).toStrictEqual({
      type: "LOGIN",
      payload: {
        username: "koala",
        password: "gumtree"
      }
    });
  });
});
