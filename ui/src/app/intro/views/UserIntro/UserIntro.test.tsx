import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import UserIntro from "./UserIntro";

import * as baseHooks from "app/base/hooks";
import dashboardURLs from "app/dashboard/urls";
import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import { actions as userActions } from "app/store/user";
import {
  authState as authStateFactory,
  sshKey as sshKeyFactory,
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userEventError as userEventErrorFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

jest.mock("app/base/hooks", () => {
  const hooks = jest.requireActual("app/base/hooks");
  return {
    ...hooks,
    useCycled: jest.fn(),
  };
});

describe("UserIntro", () => {
  let state: RootState;
  let markedIntroCompleteMock: jest.SpyInstance;
  beforeEach(() => {
    markedIntroCompleteMock = jest
      .spyOn(baseHooks, "useCycled")
      .mockImplementation(() => [false, () => null]);
    state = rootStateFactory({
      sshkey: sshKeyStateFactory({
        items: [sshKeyFactory()],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ completed_intro: false, is_superuser: true }),
        }),
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.sshkey.loading = true;
    state.user.auth.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a green tick icon when there are ssh keys", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='sshkey-card'] Icon[name='success']").exists()
    ).toBe(true);
  });

  it("displays a grey tick icon when there are no ssh keys", async () => {
    state.sshkey.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("[data-test='sshkey-card'] Icon[name='success-grey']")
        .exists()
    ).toBe(true);
  });

  it("redirects if the user has already completed the intro", () => {
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
          <UserIntro />
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
          <UserIntro />
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
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").prop("to")).toBe(
      machineURLs.machines.index
    );
  });

  it("disables the continue button if there are no ssh keys", () => {
    state.sshkey.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("ActionButton[data-test='continue-button']").prop("disabled")
    ).toBe(true);
  });

  it("hides the SSH list if there are no ssh keys", () => {
    state.sshkey.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SSHKeyList").exists()).toBe(false);
  });

  it("shows the SSH list if there are ssh keys", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SSHKeyList").exists()).toBe(true);
  });

  it("marks the intro as completed when clicking the continue button", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("ActionButton[data-test='continue-button']").simulate("click");
    expect(
      store
        .getActions()
        .some((action) => action.type === userActions.markIntroComplete().type)
    );
  });

  it("can show errors when trying to update the user", () => {
    state.user = userStateFactory({
      eventErrors: [userEventErrorFactory()],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
  });

  it("redirects when the user has been updated", () => {
    state.user.statuses.markingIntroComplete = true;
    // Mock the markedIntroComplete state to simulate the markingIntroComplete
    // state having gone from true to false.
    markedIntroCompleteMock.mockImplementationOnce(() => [true, () => null]);
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can skip the user setup", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <UserIntro />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='skip-setup']").exists()).toBe(false);
    // Open the skip confirmation.
    wrapper.find("button[data-test='skip-button']").simulate("click");
    expect(wrapper.find("[data-test='skip-setup']").exists()).toBe(true);
    // Confirm skipping MAAS setup.
    wrapper.find("button[data-test='action-confirm']").simulate("click");
    const expectedAction = userActions.markIntroComplete();
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });
});
