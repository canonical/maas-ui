import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { AddSSHKey } from "./AddSSHKey";

const mockStore = configureStore();

describe("AddSSHKey", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      sshkey: {
        loading: false,
        loaded: true,
        items: [],
      },
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

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <AddSSHKey />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    expect(
      store.getActions().some((action) => action.type === "sshkey/cleanup")
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
      wrapper.find("Formik").props().onSubmit({
        key: "ssh-rsa...",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "sshkey/create")
    ).toStrictEqual({
      type: "sshkey/create",
      payload: {
        params: {
          key: "ssh-rsa...",
        },
      },
      meta: {
        model: "sshkey",
        method: "create",
      },
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
      wrapper.find("Formik").props().onSubmit({
        auth_id: "wallaroo",
        protocol: "lp",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "sshkey/import")
    ).toStrictEqual({
      type: "sshkey/import",
      payload: {
        params: {
          auth_id: "wallaroo",
          protocol: "lp",
        },
      },
      meta: {
        model: "sshkey",
        method: "import_keys",
      },
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
    expect(actions.some((action) => action.type === "sshkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
