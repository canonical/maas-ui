import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ProxyForm from "./ProxyForm";

import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { reduceInitialState } from "testing/utils";

const mockStore = configureStore();

describe("ProxyForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
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

  it("displays a spinner if config is loading", () => {
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ProxyForm />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a text input if http proxy is enabled", () => {
    state.config.items = reduceInitialState(
      state.config.items,
      "name",
      "enable_http_proxy",
      { value: true }
    );
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
    expect(wrapper.find("Input[type='text']").exists()).toBe(true);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <ProxyForm />
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter((action) => action.type.endsWith("fetch"));

    expect(fetchActions).toEqual([
      {
        type: "config/fetch",
        meta: {
          model: "config",
          method: "list",
        },
        payload: null,
      },
    ]);
  });
});
