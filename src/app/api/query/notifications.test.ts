import type { ToastNotificationType } from "@canonical/react-components";

import {
  convertBackendIdToToastNotificationId,
  convertToastNotificationIdToBackendId,
  isHardeningNotification,
  useActiveNotifications,
  useDismissNotification,
  useDismissNotifications,
  useListNotifications,
  useNotifications,
} from "./notifications";

import { listNotificationsQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import { DEFAULT_PAGE_SIZE } from "@/app/base/constants";
import * as factory from "@/testing/factories";
import {
  mockNotifications,
  notificationResolvers,
} from "@/testing/resolvers/notifications";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const successMock = vi.fn();
const failureMock = vi.fn();
const cautionMock = vi.fn();
const infoMock = vi.fn();

vi.mock("@canonical/react-components", async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    useToastNotification: () => ({
      success: successMock,
      failure: failureMock,
      caution: cautionMock,
      info: infoMock,
    }),
  };
});

const mockServer = setupMockServer(
  notificationResolvers.listNotifications.handler(),
  notificationResolvers.dismissNotification.handler()
);

describe("useListNotifications", () => {
  it("should return notifications data", async () => {
    const { result } = renderHookWithProviders(() => useListNotifications());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toMatchObject(mockNotifications);
  });
});

describe("useActiveNotifications", () => {
  it("fetches all pages without mixing them with a single-page query", async () => {
    const items = Array.from({ length: DEFAULT_PAGE_SIZE + 1 }, (_, id) =>
      factory.notificationFactoryV3({ id })
    );
    mockServer.use(
      notificationResolvers.listNotifications.handler({
        items,
        total: items.length,
      })
    );
    const { result } = renderHookWithProviders(() => ({
      all: useActiveNotifications(),
      page: useListNotifications({
        query: { only_active: true, page: 1, size: DEFAULT_PAGE_SIZE },
      }),
    }));

    await waitFor(() => {
      expect(result.current.all.isSuccess).toBe(true);
      expect(result.current.page.isSuccess).toBe(true);
    });
    expect(result.current.all.data?.items).toEqual(items);
    expect(result.current.page.data?.items).toHaveLength(DEFAULT_PAGE_SIZE);
  });

  it("does not expose a partial list when a later page fails", async () => {
    const items = Array.from({ length: DEFAULT_PAGE_SIZE + 1 }, (_, id) =>
      factory.notificationFactoryV3({ id })
    );
    mockServer.use(
      notificationResolvers.listNotifications.error(undefined, 2),
      notificationResolvers.listNotifications.handler({
        items,
        total: items.length,
      })
    );
    const { result } = renderHookWithProviders(() => useActiveNotifications());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
  });

  it("refreshes the complete list when notifications are invalidated", async () => {
    const { result, queryClient } = renderHookWithProviders(() =>
      useActiveNotifications()
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.items).toEqual(mockNotifications.items);
    mockServer.use(
      notificationResolvers.listNotifications.handler({ items: [], total: 0 })
    );

    await queryClient.invalidateQueries({
      queryKey: listNotificationsQueryKey(),
    });

    await waitFor(() => {
      expect(result.current.data?.items).toEqual([]);
    });
  });
});

describe("isHardeningNotification", () => {
  it.each([
    ["hardening-wildcard-bind-api-bind", true],
    ["hardening-ctrl-abc123-api_bind", true],
    ["default", false],
    ["", false],
    [undefined, false],
  ])("identifies %s as hardening: %s", (ident, expected) => {
    expect(
      isHardeningNotification(factory.notificationFactoryV3({ ident }))
    ).toBe(expected);
  });
});

describe("useDismissNotification", () => {
  it("should dismiss a notification", async () => {
    const { result } = renderHookWithProviders(() => useDismissNotification());
    result.current.mutate({ path: { notification_id: 1 } });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("ID conversion helpers", () => {
  it("should convert backend id to toast id", () => {
    expect(convertBackendIdToToastNotificationId(42)).toBe("notification-42");
  });

  it("should convert toast id back to backend id", () => {
    expect(convertToastNotificationIdToBackendId("notification-42")).toBe(42);
  });
});

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success notification", async () => {
    renderHookWithProviders(() => {
      useNotifications();
    });

    await waitFor(() => {
      expect(successMock).toHaveBeenCalled();
    });
  });

  it.each(["error", "warning", "info", "success"])(
    "suppresses hardening %s toasts without suppressing unrelated notifications",
    async (category) => {
      mockServer.use(
        notificationResolvers.listNotifications.handler({
          items: [
            factory.notificationFactoryV3({
              id: 1,
              ident: "hardening-api-bind",
              category,
              message: "Unmet hardening requirement",
              dismissable: false,
            }),
            factory.notificationFactoryV3({
              id: 2,
              category: "success",
              message: "Saved successfully",
            }),
          ],
          total: 2,
        })
      );
      const { queryClient } = renderHookWithProviders(() => {
        useNotifications();
      });

      await waitFor(() => {
        expect(successMock).toHaveBeenCalledWith(
          "Saved successfully",
          [],
          "",
          "notification-2"
        );
      });
      await queryClient.invalidateQueries({
        queryKey: listNotificationsQueryKey(),
      });

      expect(successMock).toHaveBeenCalledTimes(1);
      expect(failureMock).not.toHaveBeenCalled();
      expect(cautionMock).not.toHaveBeenCalled();
      expect(infoMock).not.toHaveBeenCalled();
    }
  );
});

describe("useDismissNotifications", () => {
  it("should dismiss notification with correct id", async () => {
    const mutateMock = vi.fn();
    const { result } = renderHookWithProviders(() =>
      useDismissNotifications(mutateMock)
    );
    result.current([
      { id: "notification-1" } as ToastNotificationType,
      { id: "notification-2" } as ToastNotificationType,
    ]);
    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledTimes(2);
    });
    expect(mutateMock).toHaveBeenCalledWith({
      path: { notification_id: 1 },
    });
    expect(mutateMock).toHaveBeenCalledWith({
      path: { notification_id: 2 },
    });
  });
});
