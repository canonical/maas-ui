import SecretStorage from "./SecretStorage";

import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

it("displays loading text if Vault Status has not loaded", () => {
  const state = factory.rootState({
    general: factory.generalState({
      vaultEnabled: factory.vaultEnabledState({
        data: false,
        loaded: false,
        loading: true,
      }),
    }),
  });
  renderWithBrowserRouter(<SecretStorage />, { state });

  expect(screen.getByText(/Loading.../)).toBeInTheDocument();
});

it("renders the Vault section", () => {
  const state = factory.rootState({
    general: factory.generalState({
      vaultEnabled: factory.vaultEnabledState({
        data: false,
        loaded: true,
      }),
    }),
    controller: factory.controllerState({
      loaded: true,
      items: [factory.controller({ vault_configured: false })],
    }),
  });

  renderWithBrowserRouter(<SecretStorage />, { state });

  expect(screen.getByText(/Integrate with Vault/)).toBeInTheDocument();
});
