import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MaasIntro from "./MaasIntro";

import baseURLs from "app/base/urls";
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

describe("MaasIntro", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: "completed_intro", value: false }),
          configFactory({ name: "maas_name", value: "bionic-maas" }),
        ],
      }),
      user: userStateFactory({
        auth: authStateFactory({ user: userFactory({ is_superuser: true }) }),
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.config.loading = true;
    state.user.auth.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MaasIntro />
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("refetches the config when completed", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MaasIntro />
      </Provider>
    );
    wrapper.find("FormikForm").invoke("onSuccess")();
    expect(
      store
        .getActions()
        .some((action) => action.type === configActions.fetch().type)
    ).toBe(true);
  });

  it("sets the redirect to the user intro if it hasn't been completed", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: false, is_superuser: true }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MaasIntro />
      </Provider>
    );
    expect(wrapper.find("FormikForm").prop("savedRedirect")).toBe(
      baseURLs.intro.user
    );
  });

  it("sets the redirect to the machine list if the user intro has been completed", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true, is_superuser: true }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MaasIntro />
      </Provider>
    );
    expect(wrapper.find("FormikForm").prop("savedRedirect")).toBe(
      machineURLs.machines.index
    );
  });

  it("can update the config", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MaasIntro />
      </Provider>
    );
    wrapper.find("FormikForm").invoke("onSubmit")({ name: "my new maas" });
    const updateAction = configActions.update({
      completed_intro: true,
      maas_name: "my new maas",
    });
    expect(
      store.getActions().find((action) => action.type === updateAction.type)
    ).toStrictEqual(updateAction);
  });
});
