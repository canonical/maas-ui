import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Login } from "./Login";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  statusState as statusStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("Login", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      status: statusStateFactory({
        externalAuthURL: null,
      }),
    });
  });

  it("can render api login", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikFormContent").exists()).toBe(true);
  });

  it("can render external login", () => {
    state.status.externalAuthURL = "http://login.example.com";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".login__external").exists()).toBe(true);
  });

  it("can render external login", () => {
    state.status.externalAuthURL = "http://login.example.com";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".login__external").exists()).toBe(true);
  });

  it("can login via the api", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      username: "koala",
      password: "gumtree",
    });
    expect(
      store.getActions().find((action) => action.type === "status/login")
    ).toStrictEqual({
      type: "status/login",
      payload: {
        username: "koala",
        password: "gumtree",
      },
    });
  });

  it("shows a warning if no users have been added yet", () => {
    state.status.noUsers = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='no-users-warning']").exists()).toBe(
      true
    );
  });
});
