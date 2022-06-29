import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Routes from "./Routes";

import urls from "app/base/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Routes", () => {
  [
    {
      component: "Details",
      path: urls.preferences.details,
    },
    {
      component: "APIKeyList",
      path: urls.preferences.apiKeys.index,
    },
    {
      component: "APIKeyAdd",
      path: urls.preferences.apiKeys.add,
    },
    {
      component: "APIKeyEdit",
      path: urls.preferences.apiKeys.edit({ id: 1 }),
    },
    {
      component: "SSHKeyList",
      path: urls.preferences.sshKeys.index,
    },
    {
      component: "AddSSHKey",
      path: urls.preferences.sshKeys.add,
    },
    {
      component: "SSLKeyList",
      path: urls.preferences.sslKeys.index,
    },
    {
      component: "AddSSLKey",
      path: urls.preferences.sslKeys.add,
    },
    {
      component: "NotFound",
      path: "/not/a/path",
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Routes />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
