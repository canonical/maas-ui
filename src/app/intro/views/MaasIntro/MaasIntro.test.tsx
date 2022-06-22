import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MaasIntro from "./MaasIntro";

import { actions as configActions } from "app/store/config";
import { ConfigNames } from "app/store/config/types";
import { actions as repoActions } from "app/store/packagerepository";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  packageRepository as repoFactory,
  packageRepositoryState as repoStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("MaasIntro", () => {
  let state: RootState;
  const mainArchive = repoFactory({
    default: true,
    name: "main_archive",
    url: "http://www.mainarchive.com",
  });
  const portsArchive = repoFactory({
    default: true,
    name: "ports_archive",
    url: "http://www.portsarchive.com",
  });

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.COMPLETED_INTRO, value: false }),
          configFactory({ name: ConfigNames.MAAS_NAME, value: "bionic-maas" }),
          configFactory({
            name: ConfigNames.HTTP_PROXY,
            value: "http://www.site.com",
          }),
          configFactory({ name: ConfigNames.UPSTREAM_DNS, value: "8.8.8.8" }),
        ],
      }),
      packagerepository: repoStateFactory({
        items: [mainArchive, portsArchive],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ completed_intro: false, is_superuser: true }),
        }),
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.config.loading = true;
    state.user.auth.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/intro", key: "testKey" }]}>
          <CompatRouter>
            <MaasIntro />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can update just the config", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/intro", key: "testKey" }]}>
          <CompatRouter>
            <MaasIntro />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      httpProxy: "http://www.newproxy.com",
      mainArchiveUrl: "http://www.mainarchive.com",
      name: "my new maas",
      portsArchiveUrl: "http://www.portsarchive.com",
      upstreamDns: "0.0.0.0",
    });
    const updateConfigAction = configActions.update({
      http_proxy: "http://www.newproxy.com",
      maas_name: "my new maas",
      upstream_dns: "0.0.0.0",
    });
    const updateRepoAction = repoActions.update(mainArchive);
    expect(
      store
        .getActions()
        .find((action) => action.type === updateConfigAction.type)
    ).toStrictEqual(updateConfigAction);
    expect(
      store
        .getActions()
        .filter((action) => action.type === updateRepoAction.type).length
    ).toBe(0);
  });

  it("can dispatch actions to update the default package repository urls", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/intro", key: "testKey" }]}>
          <CompatRouter>
            <MaasIntro />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      httpProxy: "http://localhost:3000",
      mainArchiveUrl: "http://www.newmainarchive.com",
      name: "my new maas",
      portsArchiveUrl: "http://www.newportsarchive.com",
      upstreamDns: "0.0.0.0",
    });
    const updateMainArchiveAction = repoActions.update({
      id: mainArchive.id,
      name: mainArchive.name,
      url: "http://www.newmainarchive.com",
    });
    const updatePortsArchiveAction = repoActions.update({
      id: portsArchive.id,
      name: portsArchive.name,
      url: "http://www.newportsarchive.com",
    });
    const updateRepoActions = store
      .getActions()
      .filter((action) => action.type === updateMainArchiveAction.type);

    expect(updateRepoActions.length).toBe(2);
    expect(updateRepoActions[0]).toStrictEqual(updateMainArchiveAction);
    expect(updateRepoActions[1]).toStrictEqual(updatePortsArchiveAction);
  });

  it("can skip the initial MAAS setup", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/intro", key: "testKey" }]}>
          <CompatRouter>
            <MaasIntro />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='skip-setup']").exists()).toBe(false);

    // Open the skip confirmation.
    wrapper.find("button[data-testid='secondary-submit']").simulate("click");
    expect(wrapper.find("[data-testid='skip-setup']").exists()).toBe(true);

    // Confirm skipping MAAS setup.
    wrapper.find("button[data-testid='action-confirm']").simulate("click");
    const expectedAction = configActions.update({
      completed_intro: true,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);

    expect(actualAction).toStrictEqual(expectedAction);
  });
});
