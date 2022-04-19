import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Routes from "./Routes";

import prefsURLs from "app/preferences/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Routes", () => {
  [
    {
      component: "Details",
      path: prefsURLs.details,
    },
    {
      component: "APIAuthentication",
      path: prefsURLs.apiAuthentication.index,
    },
    {
      component: "APIKeyAdd",
      path: prefsURLs.apiAuthentication.keys.add,
    },
    {
      component: "APIKeyEdit",
      path: prefsURLs.apiAuthentication.keys.edit({ id: 1 }),
    },
    {
      component: "SSHKeyList",
      path: prefsURLs.sshKeys.index,
    },
    {
      component: "AddSSHKey",
      path: prefsURLs.sshKeys.add,
    },
    {
      component: "SSLKeyList",
      path: prefsURLs.sslKeys.index,
    },
    {
      component: "AddSSLKey",
      path: prefsURLs.sslKeys.add,
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
            <Routes />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
