import { screen } from "@testing-library/react";

import Security from "./Security";

import {
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  tlsCertificate as tlsCertificateFactory,
  tlsCertificateState as tlsCertificateStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

it("displays loading text if TLS certificate has not loaded", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
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
    }),
  });
  renderWithBrowserRouter(<Security />, { wrapperProps: { state } });

  expect(screen.getByText(/TLS enabled/)).toBeInTheDocument();
  expect(screen.queryByText(/TLS disabled/)).not.toBeInTheDocument();
});
