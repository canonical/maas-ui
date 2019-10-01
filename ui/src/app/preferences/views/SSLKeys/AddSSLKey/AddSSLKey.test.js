import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { AddSSLKey } from "./AddSSLKey";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

describe("AddSSLKey", () => {
  let state;

  beforeEach(() => {
    state = {
      sslkey: {
        loading: false,
        loaded: true,
        items: []
      }
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSLKey />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddSSLKey").exists()).toBe(true);
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSLKey />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(
      store.getActions().some(action => action.type === "CLEANUP_SSLKEY")
    ).toBe(true);
  });

  it("redirects when the SSL key is saved", () => {
    state.sslkey.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSLKey />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can create a SSL key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSLKey />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          key: "--- begin cert ---..."
        })
    );
    expect(
      store.getActions().find(action => action.type === "CREATE_SSLKEY")
    ).toStrictEqual({
      type: "CREATE_SSLKEY",
      payload: {
        params: {
          key: "--- begin cert ---..."
        }
      },
      meta: {
        model: "sslkey",
        method: "create"
      }
    });
  });

  it("adds a message when a SSL key is added", () => {
    state.sslkey.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSLKey />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some(action => action.type === "CLEANUP_SSLKEY")).toBe(true);
    expect(actions.some(action => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
