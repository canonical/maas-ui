import HardeningStatus from "./HardeningStatus";

import * as factory from "@/testing/factories";
import { notificationResolvers } from "@/testing/resolvers/notifications";
import { systemResolvers } from "@/testing/resolvers/system";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  notificationResolvers.listNotifications.handler({ items: [], total: 0 }),
  systemResolvers.getSystemInfo.handler(
    factory.systemInfo({ hardening_active: true })
  )
);

it("renders the failing hardening requirements from notifications", async () => {
  mockServer.use(
    notificationResolvers.listNotifications.handler({
      items: [
        factory.notificationFactoryV3({
          ident: "hardening-wildcard-bind-api-bind",
          message:
            "api_bind is not configured Run: maas config-hardening set api_bind <specific-ip-address>",
        }),
      ],
      total: 1,
    })
  );

  renderWithProviders(<HardeningStatus />);

  await waitFor(() => {
    expect(screen.getByText("api_bind")).toBeInTheDocument();
  });
  expect(
    screen.getByText("maas config-hardening set api_bind <specific-ip-address>")
  ).toBeInTheDocument();
});

it("ignores notifications that are not hardening notifications", async () => {
  mockServer.use(
    notificationResolvers.listNotifications.handler({
      items: [
        factory.notificationFactoryV3({
          ident: "default",
          message: "Some other notification",
        }),
        factory.notificationFactoryV3({ ident: undefined }),
      ],
      total: 2,
    })
  );

  renderWithProviders(<HardeningStatus />);

  await waitFor(() => {
    expect(
      screen.getByText("All hardening requirements are met.")
    ).toBeInTheDocument();
  });
});

it("shows how to enable hardening when it is not active", async () => {
  mockServer.use(
    systemResolvers.getSystemInfo.handler(
      factory.systemInfo({ hardening_active: false })
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

it("shows a loading state instead of reporting that all requirements are met", () => {
  renderWithProviders(<HardeningStatus />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();
  expect(
    screen.queryByText("All hardening requirements are met.")
  ).not.toBeInTheDocument();
});

it("does not report hardening as disabled when system information fails", async () => {
  mockServer.use(systemResolvers.getSystemInfo.error());

  renderWithProviders(<HardeningStatus />);

  expect(
    await screen.findByText("Error while fetching system information")
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/Hardening is not enabled/)
  ).not.toBeInTheDocument();
});

it("does not report all requirements as met when notifications fail", async () => {
  mockServer.use(notificationResolvers.listNotifications.error());

  renderWithProviders(<HardeningStatus />);

  expect(
    await screen.findByText("Error while fetching hardening notifications")
  ).toBeInTheDocument();
  expect(
    screen.queryByText("All hardening requirements are met.")
  ).not.toBeInTheDocument();
});
