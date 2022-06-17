import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ProxyForm from "../ProxyForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ProxyFormFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loading: false,
        loaded: true,
        items: [
          {
            name: ConfigNames.HTTP_PROXY,
            value: "http://www.url.com",
          },
          {
            name: ConfigNames.ENABLE_HTTP_PROXY,
            value: false,
          },
          {
            name: ConfigNames.USE_PEER_PROXY,
            value: false,
          },
        ],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/network", key: "testKey" }]}
        >
          <CompatRouter>
            <ProxyForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ProxyFormFields").exists()).toBe(true);
  });
});
