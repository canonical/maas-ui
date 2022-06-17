import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import NtpForm from "./NtpForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("NtpForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: ConfigNames.NTP_EXTERNAL_ONLY,
            value: false,
          },
          { name: ConfigNames.NTP_SERVERS, value: "" },
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
            <NtpForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("dispatches an action to update config on save button click", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <NtpForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      ntp_external_only: false,
      ntp_servers: "",
    });
    expect(store.getActions()).toEqual([
      {
        type: "config/update",
        payload: {
          params: [
            {
              name: "ntp_external_only",
              value: false,
            },
            { name: "ntp_servers", value: "" },
          ],
        },
        meta: {
          dispatchMultiple: true,
          model: "config",
          method: "update",
        },
      },
    ]);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <NtpForm />
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
