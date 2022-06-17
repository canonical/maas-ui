import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DnsForm from "./DnsForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DnsForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: ConfigNames.DNSSEC_VALIDATION,
            value: "auto",
            choices: [
              ["auto", "Automatic (use default root key)"],
              ["yes", "Yes (manually configured root key)"],
              [
                "no",
                "No (Disable DNSSEC; useful when upstream DNS is misconfigured)",
              ],
            ],
          },
          { name: ConfigNames.DNS_TRUSTED_ACL, value: "" },
          { name: ConfigNames.UPSTREAM_DNS, value: "" },
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
            <DnsForm />
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
            <DnsForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      dnssec_validation: "auto",
      dns_trusted_acl: "",
      upstream_dns: "",
    });
    expect(store.getActions()).toEqual([
      {
        type: "config/update",
        payload: {
          params: [
            { name: "dnssec_validation", value: "auto" },
            { name: "dns_trusted_acl", value: "" },
            { name: "upstream_dns", value: "" },
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
            <DnsForm />
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
