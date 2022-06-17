import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import VMWare from "./VMWare";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMWare", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.VCENTER_SERVER, value: "" }),
          configFactory({ name: ConfigNames.VCENTER_USERNAME, value: "" }),
          configFactory({ name: ConfigNames.VCENTER_PASSWORD, value: "" }),
          configFactory({ name: ConfigNames.VCENTER_DATACENTER, value: "" }),
        ],
      }),
    });
  });

  it("displays a spinner if config is loading", () => {
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWare />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the VMWare form if config is loaded", () => {
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWare />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("VMWareForm").exists()).toBe(true);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWare />
          </CompatRouter>
        </MemoryRouter>
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
