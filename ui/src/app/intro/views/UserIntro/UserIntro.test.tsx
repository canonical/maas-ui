import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import UserIntro from "./UserIntro";

import dashboardURLs from "app/dashboard/urls";
import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  sshKey as sshKeyFactory,
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("UserIntro", () => {
  let state: RootState;
  beforeEach(() => {
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

  it("sets the continue button to the dashboard for admins", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: false, is_superuser: true }),
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
    expect(wrapper.find("Button[data-test='continue-button']").prop("to")).toBe(
      dashboardURLs.index
    );
  });

  it("sets the continue button to the machine list for non-admins", () => {
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
    expect(wrapper.find("Button[data-test='continue-button']").prop("to")).toBe(
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
      wrapper.find("Button[data-test='continue-button']").prop("disabled")
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
});
