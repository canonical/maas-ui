import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MaasIntroSuccess from "./MaasIntroSuccess";

import dashboardURLs from "app/dashboard/urls";
import introURLs from "app/intro/urls";
import machineURLs from "app/machines/urls";
import { actions as configActions } from "app/store/config";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MaasIntroSuccess", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "completed_intro", value: false })],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ completed_intro: false, is_superuser: false }),
        }),
      }),
    });
  });

  it("links to the user intro if not yet completed", () => {
    state.user.auth = authStateFactory({
      user: userFactory({ completed_intro: false }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/success", key: "testKey" }]}
        >
          <MaasIntroSuccess />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Link[data-testid='continue-button']").prop("to")).toBe(
      introURLs.user
    );
  });

  it("links to the dashboard if an admin that has completed the user intro", () => {
    state.user.auth = authStateFactory({
      user: userFactory({ completed_intro: true, is_superuser: true }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/success", key: "testKey" }]}
        >
          <MaasIntroSuccess />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Link[data-testid='continue-button']").prop("to")).toBe(
      dashboardURLs.index
    );
  });

  it("links to the machine list if a non-admin that has completed the user intro", () => {
    state.user.auth = authStateFactory({
      user: userFactory({ completed_intro: true, is_superuser: false }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/success", key: "testKey" }]}
        >
          <MaasIntroSuccess />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Link[data-testid='continue-button']").prop("to")).toBe(
      machineURLs.machines.index
    );
  });

  it("dispatches an action to update completed intro config", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/success", key: "testKey" }]}
        >
          <MaasIntroSuccess />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Link[data-testid='continue-button']").simulate("click");

    const expectedAction = configActions.update({ completed_intro: true });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
