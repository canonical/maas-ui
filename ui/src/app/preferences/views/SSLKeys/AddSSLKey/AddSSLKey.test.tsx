import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { AddSSLKey } from "./AddSSLKey";

import type { RootState } from "app/store/root/types";
import {
  sslKeyState as sslKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddSSLKey", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      sslkey: sslKeyStateFactory({
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
          <CompatRouter>
            <AddSSLKey />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddSSLKey").exists()).toBe(true);
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <AddSSLKey />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    expect(
      store.getActions().some((action) => action.type === "sslkey/cleanup")
    ).toBe(true);
  });

  it("redirects when the SSL key is saved", () => {
    state.sslkey.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <AddSSLKey />
          </CompatRouter>
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
          <CompatRouter>
            <AddSSLKey />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        key: "--- begin cert ---...",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "sslkey/create")
    ).toStrictEqual({
      type: "sslkey/create",
      payload: {
        params: {
          key: "--- begin cert ---...",
        },
      },
      meta: {
        model: "sslkey",
        method: "create",
      },
    });
  });

  it("adds a message when a SSL key is added", () => {
    state.sslkey.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <AddSSLKey />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "sslkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
