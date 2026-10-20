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

const getGroupItems = (items: NavItem[], group: string) =>
  items.find((item) => item.label === group)?.items;

const getDisabledItems = (items: NavItem[], group: string) =>
  getGroupItems(items, group)
    ?.filter((item) => item.disabled)
    .map((item) => item.label);

const getDisabledImagesItems = (items: NavItem[]) =>
  getDisabledItems(items, "Images & operating systems");

const getDisabledSecurityItems = (items: NavItem[]) =>
  getDisabledItems(items, "Security");

const getDisabledUserManagementItems = (items: NavItem[]) =>
  getDisabledItems(items, "User management");

const getGroupItem = (items: NavItem[], group: string, label: string) =>
  getGroupItems(items, group)?.find((item) => item.label === label);

const getLicenseKeysItem = (items: NavItem[]) =>
  getGroupItem(items, "Images & operating systems", "License keys");

const getDisabledScriptsItems = (items: NavItem[]) =>
  getDisabledItems(items, "Scripts");

const isGroupItemDisabled = (items: NavItem[], group: string, label: string) =>
  getGroupItem(items, group, label)?.disabled;

it("returns base nav items while entitlements are pending", () => {
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  expect(result.current).toStrictEqual(settingsNavItems);
});

it("does not disable any Images items with both entitlements", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS }),
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES }),
      factory.entitlement({
        entitlement: Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
      }),
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_IDENTITIES }),
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_LICENSE_KEYS }),
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
  expect(getDisabledUserManagementItems(result.current.items)).toEqual([]);
  expect(getLicenseKeysItem(result.current.items)?.disabled).toBeFalsy();
  expect(getDisabledScriptsItems(result.current.items)).toEqual([]);
  expect(
    isGroupItemDisabled(result.current.items, "Networking", "DHCP snippets")
  ).toBeFalsy();
  expect(
    isGroupItemDisabled(
      result.current.items,
      "Images & operating systems",
      "Package repos"
    )
  ).toBeFalsy();
});

it("disables Scripts, DHCP snippets and Package repos without the global entities entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS }),
    ])
  );
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledScriptsItems(result.current)).toEqual([
      "Commissioning scripts",
      "Deployment scripts",
      "Testing scripts",
    ]);
  });
  expect(
    isGroupItemDisabled(result.current, "Networking", "DHCP snippets")
  ).toBe(true);
  expect(
    isGroupItemDisabled(
      result.current,
      "Images & operating systems",
      "Package repos"
    )
  ).toBe(true);
});

it("never disables Storage", async () => {
  mockServer.use(authResolvers.getMeEntitlements.handler([]));
  const { result } = renderHookWithProviders(() => ({
    items: useSettingsNavItems(),
    entitlements: useHasEntitlements([Entitlement.CAN_VIEW_CONFIGURATIONS]),
  }));

  await waitFor(() => {
    expect(result.current.entitlements.isPending).toBe(false);
  });
  expect(
    getGroupItem(result.current.items, "Configuration", "Storage")?.disabled
  ).toBeFalsy();
});

it("disables License keys without the license keys entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS }),
    ])
  );
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getLicenseKeysItem(result.current)?.disabled).toBe(true);
  });
});

it("disables User management items without the identities entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS }),
    ])
  );
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledUserManagementItems(result.current)).toEqual([
      "Users",
      "Groups",
      "OIDC/Single sign-on",
    ]);
  });
});

it("disables the configurations-gated Security items without the entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES }),
      factory.entitlement({
        entitlement: Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
      }),
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

it("disables Trusted SSH host keys without the global entities entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS }),
    ])
  );
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledSecurityItems(result.current)).toEqual([
      "Trusted SSH host keys",
    ]);
  });
});

it("never disables Token expiration or Hardening status", async () => {
  mockServer.use(authResolvers.getMeEntitlements.handler([]));
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledSecurityItems(result.current)).toEqual([
      "Security protocols",
      "Secret storage",
      "IPMI settings",
      "Trusted SSH host keys",
    ]);
  });
});

it("disables Windows and VMware without the configurations entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES }),
      factory.entitlement({
        entitlement: Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
      }),
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_LICENSE_KEYS }),
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
      factory.entitlement({
        entitlement: Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
      }),
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_LICENSE_KEYS }),
    ])
  );
  const { result } = renderHookWithProviders(() => useSettingsNavItems());

  await waitFor(() => {
    expect(getDisabledImagesItems(result.current)).toEqual(["Sources"]);
  });
});
