import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import IntroSection from "./IntroSection";

import dashboardURLs from "app/dashboard/urls";
import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userEventError as userEventErrorFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("IntroSection", () => {
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

  it("can display a loading spinner", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <IntroSection loading={true}>Intro content</IntroSection>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can redirect to close the intro", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <IntroSection closeIntro={true}>Intro content</IntroSection>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("redirects to the dashboard for admins", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true, is_superuser: true }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <IntroSection closeIntro={true}>Intro content</IntroSection>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").prop("to")).toBe(dashboardURLs.index);
  });

  it("redirects to the machine list for non-admins", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true, is_superuser: false }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <IntroSection closeIntro={true}>Intro content</IntroSection>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").prop("to")).toBe(
      machineURLs.machines.index
    );
  });

  it("can show errors", () => {
    state.user = userStateFactory({
      eventErrors: [userEventErrorFactory()],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <IntroSection errors="Uh oh!">Intro content</IntroSection>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
  });
});
