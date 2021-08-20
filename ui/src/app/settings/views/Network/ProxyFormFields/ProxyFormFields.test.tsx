import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ProxyForm from "../ProxyForm";

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
            name: "http_proxy",
            value: "http://www.url.com",
          },
          {
            name: "enable_http_proxy",
            value: false,
          },
          {
            name: "use_peer_proxy",
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
          <ProxyForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ProxyFormFields").exists()).toBe(true);
  });
});
