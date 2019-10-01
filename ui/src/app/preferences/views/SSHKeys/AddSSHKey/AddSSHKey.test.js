import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { AddSSHKey } from "./AddSSHKey";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

describe("AddSSHKey", () => {
  let state;

  beforeEach(() => {
    state = {
      sshkey: {
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
          <AddSSHKey />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddSSHKey").exists()).toBe(true);
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSHKey />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(
      store.getActions().some(action => action.type === "CLEANUP_SSHKEY")
    ).toBe(true);
  });

  it("redirects when the SSH key is saved", () => {
    state.sshkey.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSHKey />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can upload an SSH key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSHKey />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          key: "ssh-rsa..."
        })
    );
    expect(
      store.getActions().find(action => action.type === "CREATE_SSHKEY")
    ).toStrictEqual({
      type: "CREATE_SSHKEY",
      payload: {
        params: {
          key: "ssh-rsa..."
        }
      },
      meta: {
        model: "sshkey",
        method: "create"
      }
    });
  });

  it("can import an SSH key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSHKey />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          auth_id: "wallaroo",
          protocol: "lp"
        })
    );
    expect(
      store.getActions().find(action => action.type === "IMPORT_SSHKEY")
    ).toStrictEqual({
      type: "IMPORT_SSHKEY",
      payload: {
        params: {
          auth_id: "wallaroo",
          protocol: "lp"
        }
      },
      meta: {
        model: "sshkey",
        method: "import_keys"
      }
    });
  });

  it("adds a message when a SSH key is added", () => {
    state.sshkey.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSHKey />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some(action => action.type === "CLEANUP_SSHKEY")).toBe(true);
    expect(actions.some(action => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
