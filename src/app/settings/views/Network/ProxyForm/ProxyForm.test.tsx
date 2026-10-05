import ProxyForm from "./ProxyForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  screen,
  renderWithProviders,
  setupMockServer,
  mockIsPending,
  userEvent,
  waitFor,
} from "@/testing/utils";

const configItems = [
  { name: ConfigNames.HTTP_PROXY, value: "http://www.url.com" },
  { name: ConfigNames.ENABLE_HTTP_PROXY, value: false },
  { name: ConfigNames.USE_PEER_PROXY, value: false },
];

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({ items: configItems })
);

describe("ProxyForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
      }),
    });
  });

  it("displays a skeleton while the configurations are loading", () => {
    mockIsPending();
    renderWithProviders(<ProxyForm />, { state });

    expect(
      screen.getAllByRole("progressbar", { hidden: true }).length
    ).toBeGreaterThan(0);
  });

  it("displays an error notification when the request fails", async () => {
    mockServer.use(configurationsResolvers.listConfigurations.error());
    renderWithProviders(<ProxyForm />, { state });

    expect(
      await screen.findByText("Error while fetching proxy configurations")
    ).toBeInTheDocument();
  });

  it("selects no proxy if http proxy is disabled", async () => {
    renderWithProviders(<ProxyForm />, { state });

    expect(
      await screen.findByRole("radio", { name: "Don't use a proxy" })
    ).toBeChecked();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("displays a text input if http proxy is enabled", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({
        items: [
          { name: ConfigNames.HTTP_PROXY, value: "http://www.url.com" },
          { name: ConfigNames.ENABLE_HTTP_PROXY, value: true },
          { name: ConfigNames.USE_PEER_PROXY, value: false },
        ],
      })
    );
    renderWithProviders(<ProxyForm />, { state });

    expect(
      await screen.findByRole("radio", { name: "External" })
    ).toBeChecked();
    expect(screen.getByRole("textbox")).toHaveValue("http://www.url.com");
  });

  it("selects the peer proxy if peer proxy is enabled", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({
        items: [
          { name: ConfigNames.HTTP_PROXY, value: "http://www.url.com" },
          { name: ConfigNames.ENABLE_HTTP_PROXY, value: true },
          { name: ConfigNames.USE_PEER_PROXY, value: true },
        ],
      })
    );
    renderWithProviders(<ProxyForm />, { state });

    expect(await screen.findByRole("radio", { name: "Peer" })).toBeChecked();
  });

  it("selects the built-in proxy if http proxy is enabled without a URL", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({
        items: [
          { name: ConfigNames.HTTP_PROXY, value: "" },
          { name: ConfigNames.ENABLE_HTTP_PROXY, value: true },
          { name: ConfigNames.USE_PEER_PROXY, value: false },
        ],
      })
    );
    renderWithProviders(<ProxyForm />, { state });

    expect(
      await screen.findByRole("radio", { name: "MAAS built-in" })
    ).toBeChecked();
  });

  it("dispatches an action to update config on save", async () => {
    const { store } = renderWithProviders(<ProxyForm />, { state });
    const builtInRadio = await screen.findByRole("radio", {
      name: "MAAS built-in",
    });
    await waitFor(() => {
      expect(builtInRadio).not.toBeDisabled();
    });

    await userEvent.click(builtInRadio);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(
        store.getActions().find((action) => action.type === "config/update")
      ).toEqual({
        type: "config/update",
        meta: {
          model: "config",
          method: "bulk_update",
        },
        payload: {
          params: {
            items: {
              http_proxy: "",
              enable_http_proxy: true,
              use_peer_proxy: false,
            },
          },
        },
      });
    });
  });

  it("disables fields without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
        }),
      ])
    );
    renderWithProviders(<ProxyForm />, { state });
    const noProxyRadio = await screen.findByRole("radio", {
      name: "Don't use a proxy",
    });
    await waitFor(() => {
      expect(noProxyRadio).toBeDisabled();
    });
    expect(
      screen.queryByRole("button", { name: "Save" })
    ).not.toBeInTheDocument();
  });
});
