import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Commissioning from "./Commissioning";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Commissioning", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "bionic",
            choices: [],
          },
          {
            name: ConfigNames.DEFAULT_MIN_HWE_KERNEL,
            value: "ga-16.04-lowlatency",
            choices: [],
          },
        ],
      }),
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: true,
        }),
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
            <Commissioning />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the Commissioning form if config is loaded", () => {
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <Commissioning />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("CommissioningForm").exists()).toBe(true);
  });

  it(`dispatches actions to fetch config and general os info if either has not
    already loaded`, () => {
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <Commissioning />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter(
        (action) =>
          action.type.startsWith("config/fetch") ||
          action.type.startsWith("general/fetch")
      );

    expect(fetchActions).toEqual([
      {
        type: "config/fetch",
        meta: { model: "config", method: "list" },
        payload: null,
      },
      {
        type: "general/fetchOsInfo",
        meta: {
          cache: true,
          model: "general",
          method: "osinfo",
        },
        payload: null,
      },
    ]);
  });
});
