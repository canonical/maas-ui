import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import HardeningNotification from "./HardeningNotification";

import { listNotificationsQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { notificationResolvers } from "@/testing/resolvers/notifications";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const hardeningNotification = factory.notificationFactoryV3({
  id: 1,
  ident: "hardening-api-bind",
  category: "error",
  dismissable: false,
});

const mockServer = setupMockServer(
  notificationResolvers.listNotifications.handler({
    items: [hardeningNotification],
    total: 1,
  })
);

const renderBanner = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  renderWithProviders(
    <QueryClientProvider client={queryClient}>
      <HardeningNotification />
    </QueryClientProvider>
  );
  return { queryClient };
};

it.each([
  [1, "1 condition has"],
  [2, "2 conditions have"],
])(
  "shows one non-dismissible banner for %s requirements",
  async (count, text) => {
    mockServer.use(
      notificationResolvers.listNotifications.handler({
        items: Array.from({ length: count }, (_, id) => ({
          ...hardeningNotification,
          id,
        })),
        total: count,
      })
    );
    renderBanner();

    expect(
      await screen.findByText(
        `Hardening has been enabled, but ${text} not been met.`
      )
    ).toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to hardening settings..." })
    ).toHaveAttribute("href", urls.settings.security.hardeningStatus);
  }
);

it("updates the count and removes the banner when requirements are resolved", async () => {
  const { queryClient } = renderBanner();
  expect(
    await screen.findByText(/1 condition has not been met/)
  ).toBeInTheDocument();

  mockServer.use(
    notificationResolvers.listNotifications.handler({
      items: [hardeningNotification, { ...hardeningNotification, id: 2 }],
      total: 2,
    })
  );
  await queryClient.invalidateQueries({
    queryKey: listNotificationsQueryKey(),
  });
  expect(
    await screen.findByText(/2 conditions have not been met/)
  ).toBeInTheDocument();

  mockServer.use(
    notificationResolvers.listNotifications.handler({
      items: [factory.notificationFactoryV3({ ident: undefined })],
      total: 1,
    })
  );
  await queryClient.invalidateQueries({
    queryKey: listNotificationsQueryKey(),
  });
  await waitFor(() => {
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

it("keeps the last known warning and displays an error when refreshing fails", async () => {
  const { queryClient } = renderBanner();
  expect(
    await screen.findByText(/1 condition has not been met/)
  ).toBeInTheDocument();

  mockServer.use(notificationResolvers.listNotifications.error());
  await queryClient.invalidateQueries({
    queryKey: listNotificationsQueryKey(),
  });

  expect(
    await screen.findByText("Error while fetching hardening notifications")
  ).toBeInTheDocument();
  expect(screen.getByText(/1 condition has not been met/)).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
