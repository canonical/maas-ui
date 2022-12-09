import { screen } from "@testing-library/react";

import Security from "./Security";

import {
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  tlsCertificate as tlsCertificateFactory,
  tlsCertificateState as tlsCertificateStateFactory,
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  vaultEnabledState as vaultEnabledStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

it("displays loading text if TLS certificate has not loaded", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: null,
        loaded: false,
        loading: true,
      }),
      vaultEnabled: vaultEnabledStateFactory({
        data: false,
        loaded: true,
      }),
    }),
  });
  renderWithBrowserRouter(<Security />, { state });

  expect(screen.getByText(/Loading.../)).toBeInTheDocument();
});

it("displays loading text if Vault Status has not loaded", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: null,
        loaded: true,
      }),
      vaultEnabled: vaultEnabledStateFactory({
        data: false,
        loaded: false,
        loading: true,
      }),
    }),
  });
  renderWithBrowserRouter(<Security />, { state });

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
        data: false,
        loaded: true,
      }),
    }),
  });
  renderWithBrowserRouter(<Security />, { state });

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
        data: false,
        loaded: true,
      }),
    }),
  });
  renderWithBrowserRouter(<Security />, { state });

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
        data: false,
        loaded: true,
      }),
    }),
    controller: controllerStateFactory({
      loaded: true,
      items: [controllerFactory({ vault_configured: false })],
    }),
  });

  renderWithBrowserRouter(<Security />, { state });

  expect(screen.getByText(/Integrate with Vault/)).toBeInTheDocument();
});

it("renders the Session Timeout section", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: tlsCertificateFactory(),
        loaded: true,
      }),
      vaultEnabled: vaultEnabledStateFactory({
        data: false,
        loaded: true,
      }),
    }),
    controller: controllerStateFactory({
      loaded: true,
      items: [controllerFactory({ vault_configured: false })],
    }),
  });

  renderWithBrowserRouter(<Security />, { state });
  expect(screen.getByText(/Session timeout expiration/)).toBeInTheDocument();
});
