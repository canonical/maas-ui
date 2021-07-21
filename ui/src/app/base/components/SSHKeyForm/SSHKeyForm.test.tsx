import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { SSHKeyForm } from "./SSHKeyForm";

import type { RootState } from "app/store/root/types";
import {
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SSHKeyForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      sshkey: sshKeyStateFactory({
        loading: false,
        loaded: true,
        items: [],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <SSHKeyForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SSHKeyForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <SSHKeyForm />
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

  it("can upload an SSH key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <SSHKeyForm />
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
          <SSHKeyForm />
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <SSHKeyForm />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Formik").invoke("onSubmit")({
      auth_id: "wallaroo",
      protocol: "lp",
    });
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "sshkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
