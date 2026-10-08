import { useSettingsNavItems } from "./useSettingsNavItems";

import type { NavItem } from "@/app/base/components/SecondaryNavigation/SecondaryNavigation";
import { useHasEntitlements } from "@/app/base/hooks";
import { settingsNavItems } from "@/app/settings/constants";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

const getDisabledItems = (items: NavItem[], group: string) =>
  items
    .find((item) => item.label === group)
    ?.items?.filter((item) => item.disabled)
    .map((item) => item.label);

const getDisabledImagesItems = (items: NavItem[]) =>
  getDisabledItems(items, "Images");

const getDisabledSecurityItems = (items: NavItem[]) =>
  getDisabledItems(items, "Security");

it("returns base nav items while entitlements are pending", () => {
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  expect(result.current).toStrictEqual(settingsNavItems);
});

it("does not disable any Images items with both entitlements", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS }),
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES }),
    ])
  );
  const { result } = renderHookWithProviders(() => ({
    items: useSettingsNavItems(),
    entitlements: useHasEntitlements([Entitlement.CAN_VIEW_CONFIGURATIONS]),
  }));

  await waitFor(() => {
    expect(result.current.entitlements.isPending).toBe(false);
  });
  expect(getDisabledImagesItems(result.current.items)).toEqual([]);
  expect(getDisabledSecurityItems(result.current.items)).toEqual([]);
});

it("disables the configurations-gated Security items without the entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES }),
    ])
  );
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledSecurityItems(result.current)).toEqual([
      "Security protocols",
      "Secret storage",
      "IPMI settings",
    ]);
  });
});

it("never disables Token expiration", async () => {
  mockServer.use(authResolvers.getMeEntitlements.handler([]));
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledSecurityItems(result.current)).toHaveLength(3);
  });
  expect(getDisabledSecurityItems(result.current)).not.toContain(
    "Token expiration"
  );
});

it("disables Windows and VMware without the configurations entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES }),
    ])
  );
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledImagesItems(result.current)).toEqual([
      "Windows",
      "VMware",
    ]);
  });
});

it("disables Sources without the boot entities entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS }),
    ])
  );
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledImagesItems(result.current)).toEqual(["Sources"]);
  });
});
