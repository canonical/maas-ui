import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Intro from "./Intro";

import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Intro", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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
