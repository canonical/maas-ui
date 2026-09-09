import HardeningStatus from "./HardeningStatus";

import { systemInfo as systemInfoFactory } from "@/testing/factories";
import * as factory from "@/testing/factories";
import { systemResolvers } from "@/testing/resolvers/system";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  systemResolvers.getSystemInfo.handler(
    systemInfoFactory({ hardening_active: true })
  )
);

it("renders the failing hardening requirements from notifications", async () => {
  const state = factory.rootState({
    notification: factory.notificationState({
      loaded: true,
      items: [
        factory.notification({
          ident: "hardening-wildcard-bind-api-bind",
          message:
            "api_bind is not configured Run: maas config-hardening set api_bind <specific-ip-address>",
        }),
      ],
    }),
  });

  renderWithProviders(<HardeningStatus />, { state });

  await waitFor(() => {
    expect(screen.getByText("api_bind")).toBeInTheDocument();
  });
  expect(
    screen.getByText("maas config-hardening set api_bind <specific-ip-address>")
  ).toBeInTheDocument();
});

it("ignores notifications that are not hardening notifications", async () => {
  const state = factory.rootState({
    notification: factory.notificationState({
      loaded: true,
      items: [
        factory.notification({
          ident: "default",
          message: "Some other notification",
        }),
      ],
    }),
  });

  renderWithProviders(<HardeningStatus />, { state });

  await waitFor(() => {
    expect(
      screen.getByText("All hardening requirements are met.")
    ).toBeInTheDocument();
  });
});

it("shows how to enable hardening when it is not active", async () => {
  mockServer.use(
    systemResolvers.getSystemInfo.handler(
      systemInfoFactory({ hardening_active: false })
    )
  );

  renderWithProviders(<HardeningStatus />);

  await waitFor(() => {
    expect(screen.getByText(/Hardening is not enabled/)).toBeInTheDocument();
  });
  expect(screen.getByText("maas config-hardening enable")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Learn more about security hardening" })
  ).toBeInTheDocument();
  // The requirements table is not rendered when hardening is disabled.
  expect(
    screen.queryByText("All hardening requirements are met.")
  ).not.toBeInTheDocument();
});
