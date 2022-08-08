import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
// import { submitFormikForm } from "testing/utils";

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

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DnsForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("dispatches an action to update config on save button click", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DnsForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const upstream_dns_input = screen.getByRole("textbox", {
      name: "Upstream DNS used to resolve domains not managed by this MAAS (space-separated IP addresses)",
    });

    await userEvent.type(upstream_dns_input, "0.0.0.0");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(store.getActions()).toEqual([
      {
        type: "config/update",
        payload: {
          params: [
            { name: "dnssec_validation", value: "auto" },
            { name: "dns_trusted_acl", value: "" },
            { name: "upstream_dns", value: "0.0.0.0" },
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

    render(
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
