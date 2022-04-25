import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { APIKeyForm } from "./APIKeyForm";

import type { RootState } from "app/store/root/types";
import {
  token as tokenFactory,
  tokenState as tokenStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("APIKeyForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      token: tokenStateFactory({
        loading: false,
        loaded: true,
        items: [
          tokenFactory({
            id: 1,
            key: "ssh-rsa aabb",
            consumer: { key: "abc", name: "Name" },
          }),
        ],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <APIKeyForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("APIKeyForm").exists()).toBe(true);
  });

  it("can create an API key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <APIKeyForm />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        name: "Token name",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "token/create")
    ).toStrictEqual({
      type: "token/create",
      payload: {
        params: {
          name: "Token name",
        },
      },
      meta: {
        model: "token",
        method: "create",
      },
    });
  });

  it("can update an API key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <APIKeyForm token={state.token.items[0]} />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        name: "New token name",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "token/update")
    ).toStrictEqual({
      type: "token/update",
      payload: {
        params: {
          id: 1,
          name: "New token name",
        },
      },
      meta: {
        model: "token",
        method: "update",
      },
    });
  });
});
