import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Intro from "./Intro";

import introURLs from "app/intro/urls";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Intro", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "completed_intro", value: false }],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ completed_intro: false, is_superuser: true }),
        }),
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.user.auth.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/intro" }]}>
          <Intro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a message if the user is not an admin", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: false, is_superuser: false }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/intro" }]}>
          <Intro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("IncompleteCard").exists()).toBe(true);
  });

  it("exits the intro if both intros have been completed", () => {
    state.config = configStateFactory({
      items: [{ name: "completed_intro", value: true }],
    });
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true, is_superuser: true }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: introURLs.index }]}>
          <Intro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("returns to the start when loading the user intro and the main intro is incomplete", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: introURLs.user }]}>
          <Intro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Router").prop("history").location.pathname).toBe(
      introURLs.index
    );
  });

  it("skips to the user intro when loading the main intro when it is complete", () => {
    state.config = configStateFactory({
      items: [{ name: "completed_intro", value: true }],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: introURLs.index }]}>
          <Intro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Router").prop("history").location.pathname).toBe(
      introURLs.user
    );
  });

  it("can display the routes", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/intro" }]}>
          <Intro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Switch").exists()).toBe(true);
  });
});
