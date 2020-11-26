import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { APIKeyForm } from "./APIKeyForm";

const mockStore = configureStore();

describe("APIKeyForm", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      token: {
        loading: false,
        loaded: true,
        items: [{ id: 1, key: "ssh-rsa aabb", consumer: { name: "Name" } }],
      },
    };
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
      wrapper.find("Formik").props().onSubmit({
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
      wrapper.find("Formik").props().onSubmit({
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
