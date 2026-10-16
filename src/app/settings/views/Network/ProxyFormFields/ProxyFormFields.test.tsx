import ProxyForm from "../ProxyForm";

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
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({
    items: [
      { name: ConfigNames.HTTP_PROXY, value: "http://www.url.com" },
      { name: ConfigNames.ENABLE_HTTP_PROXY, value: false },
      { name: ConfigNames.USE_PEER_PROXY, value: false },
    ],
  })
);

describe("ProxyFormFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loading: false,
        loaded: true,
      }),
    });
  });

  it("can render", async () => {
    renderWithProviders(<ProxyForm />, { state });

    const fields = ["Don't use a proxy", "MAAS built-in", "External", "Peer"];

    expect(
      await screen.findByRole("radio", { name: fields[0] })
    ).toBeInTheDocument();
    fields.forEach((field) => {
      expect(screen.getByRole("radio", { name: field })).toBeInTheDocument();
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

    const fields = ["Don't use a proxy", "MAAS built-in", "External", "Peer"];

    const noProxyRadio = await screen.findByRole("radio", { name: fields[0] });
    await waitFor(() => {
      expect(noProxyRadio).toBeDisabled();
    });
    fields.forEach((field) => {
      expect(screen.getByRole("radio", { name: field })).toBeDisabled();
    });
  });
});
