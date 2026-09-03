import { waitFor } from "@testing-library/react";

import NetworkDiscoverySettings from "@/app/settings/views/Network/NetworkDiscoverySettings/NetworkDiscoverySettings";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { authResolvers, mockAuth } from "@/testing/resolvers/auth";
import { networkDiscoveryResolvers } from "@/testing/resolvers/networkDiscovery";
import { renderWithProviders, screen, setupMockServer } from "@/testing/utils";

setupMockServer(
  networkDiscoveryResolvers.listNetworkDiscoveries.handler(),
  authResolvers.getCurrentUser.handler(mockAuth),
  authResolvers.getMeEntitlements.handler(),
  authResolvers.getMeStatistics.handler()
);

describe("NetworkDiscoverySettings", () => {
  it("shows disabled discovery warning", async () => {
    const state = factory.rootState({
      config: factory.configState({
        items: [
          {
            name: ConfigNames.NETWORK_DISCOVERY,
            value: "disabled",
          },
        ],
        loaded: true,
      }),
    });
    renderWithProviders(<NetworkDiscoverySettings />, { state });
    await waitFor(() => {
      expect(
        screen.getByText(
          "List of devices will not update as discovery is turned off."
        )
      ).toBeInTheDocument();
    });
  });
});
