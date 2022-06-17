import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import GeneralForm from "./GeneralForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("GeneralForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.MAAS_NAME, value: "bionic-maas" }),
          configFactory({ name: ConfigNames.ENABLE_ANALYTICS, value: true }),
          configFactory({
            name: ConfigNames.RELEASE_NOTIFICATIONS,
            value: true,
          }),
        ],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);

    const wrapper = shallow(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("GeneralForm").exists()).toBe(true);
  });

  it("sets maas_name value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("input[name='maas_name']").props().value).toBe(
      "bionic-maas"
    );
  });

  it("sets enable_analytics value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("input[name='enable_analytics']").props().value).toBe(
      true
    );
  });

  it("sets release_notifications value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("input[name='release_notifications']").props().value
    ).toBe(true);
  });

  it("can trigger usabilla when the notifications are turned off", () => {
    const store = mockStore(state);
    window.usabilla_live = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      enable_analytics: true,
      release_notifications: false,
    });
    expect(window.usabilla_live).toHaveBeenCalled();
  });
});
