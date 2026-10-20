import { useIsMachineActionDisabled, useMachineActionMenus } from "./hooks";

import type { ExternalAuthType } from "@/app/apiclient";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { renderHookWithProviders, setupMockServer } from "@/testing/utils";

setupMockServer(authResolvers.getMeEntitlements.handler([]));

describe("useIsMachineActionDisabled", () => {
  it.each<ExternalAuthType | null>(["RBAC", "CANDID", null])(
    "uses backend actions for loaded machines in auth mode %s",
    (externalAuthType) => {
      const { result } = renderHookWithProviders(
        () => ({
          details: useIsMachineActionDisabled(true, "abc123"),
          bulk: useIsMachineActionDisabled(false),
        }),
        {
          state: factory.rootState({
            status: factory.statusState({ externalAuthType }),
            machine: factory.machineState({
              items: [
                factory.machine({
                  system_id: "abc123",
                  actions: [NodeActions.DEPLOY],
                }),
                factory.machine({
                  system_id: "def456",
                  actions: [NodeActions.COMMISSION],
                }),
              ],
              selected: { items: ["abc123", "def456"] },
            }),
          }),
        }
      );
      expect(result.current.details(NodeActions.DEPLOY)).toBe(false);
      expect(result.current.details(NodeActions.COMMISSION)).toBe(true);
      expect(result.current.bulk(NodeActions.DEPLOY)).toBe(false);
      expect(result.current.bulk(NodeActions.COMMISSION)).toBe(false);
      expect(result.current.bulk(NodeActions.DELETE)).toBe(true);
    }
  );

  describe.each<ExternalAuthType | null>(["RBAC", "CANDID", null])(
    "unresolved selections in auth mode %s",
    (externalAuthType) => {
      it.each([
        { filter: {} },
        { groups: ["admin"], grouping: null },
        { items: ["unloaded"] },
      ])("only bypasses entitlement checks for RBAC (%j)", (selected) => {
        const { result } = renderHookWithProviders(
          () => useIsMachineActionDisabled(false),
          {
            state: factory.rootState({
              status: factory.statusState({ externalAuthType }),
              machine: factory.machineState({ selected }),
            }),
          }
        );

        expect(result.current(NodeActions.DEPLOY)).toBe(false);
        expect(result.current(NodeActions.DELETE)).toBe(
          externalAuthType !== "RBAC"
        );
        expect(result.current(NodeActions.COMMISSION)).toBe(
          externalAuthType !== "RBAC"
        );
      });
    }
  );
});

describe("useMachineActionMenus", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // TODO: Remove when DPU feature flag is removed https://warthogs.atlassian.net/browse/MAASENG-4186
  it("includes 'Power cycle' when the DPU feature flag is enabled", () => {
    vi.stubEnv("VITE_APP_DPU_PROVISIONING", "true");
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(false)
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.POWER_CYCLE)
    ).toBe(true);
  });

  // TODO: Remove when DPU feature flag is removed https://warthogs.atlassian.net/browse/MAASENG-4186
  it("excludes 'Power cycle' when the DPU feature flag is disabled", () => {
    vi.stubEnv("VITE_APP_DPU_PROVISIONING", "false");
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(false)
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.POWER_CYCLE)
    ).toBe(false);
  });

  it("includes 'Check power' if viewing details and a system ID is provided", () => {
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(true, "abc123")
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.CHECK_POWER)
    ).toBe(true);
  });

  it("excludes 'Check power' if viewing details and a system ID is not provided", () => {
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(true, undefined)
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.CHECK_POWER)
    ).toBe(false);
  });

  it("excludes 'Check power' if not viewing details", () => {
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(false)
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.CHECK_POWER)
    ).toBe(false);
  });
});
