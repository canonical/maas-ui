import { screen } from "@testing-library/react";

import Security from "./Security";

import {
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  tlsCertificate as tlsCertificateFactory,
  tlsCertificateState as tlsCertificateStateFactory,
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  vaultEnabled as vaultEnabledFactory,
  vaultEnabledState as vaultEnabledStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

it("displays loading text if TLS certificate or Vault Status has not loaded", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: null,
        loaded: false,
      }),
      vaultEnabled: vaultEnabledStateFactory({
        data: null,
        loaded: false,
      }),
    }),
  });
  renderWithBrowserRouter(<Security />, { wrapperProps: { state } });

  expect(screen.getByText(/Loading.../)).toBeInTheDocument();
});

it("renders TLS disabled section if no TLS certificate is present", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: null,
        loaded: true,
      }),
      vaultEnabled: vaultEnabledStateFactory({
        data: null,
        loaded: true,
      }),
    }),
  });
  renderWithBrowserRouter(<Security />, { wrapperProps: { state } });

  expect(screen.getByText(/TLS disabled/)).toBeInTheDocument();
  expect(screen.queryByText(/TLS enabled/)).not.toBeInTheDocument();
});

it("renders TLS enabled section if TLS certificate is present", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: tlsCertificateFactory(),
        loaded: true,
      }),
      vaultEnabled: vaultEnabledStateFactory({
        data: null,
        loaded: true,
      }),
    }),
  });
  renderWithBrowserRouter(<Security />, { wrapperProps: { state } });

  expect(screen.getByText(/TLS enabled/)).toBeInTheDocument();
  expect(screen.queryByText(/TLS disabled/)).not.toBeInTheDocument();
});

it("renders the Vault section", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: tlsCertificateFactory(),
        loaded: true,
      }),
      vaultEnabled: vaultEnabledStateFactory({
        data: vaultEnabledFactory({ vault_enabled: false }),
        loaded: true,
      }),
    }),
    controller: controllerStateFactory({
      loaded: true,
      items: [controllerFactory({ vault_configured: false })],
    }),
  });

  renderWithBrowserRouter(<Security />, { wrapperProps: { state } });

  expect(screen.getByText(/Integrate with Vault/)).toBeInTheDocument();
});
