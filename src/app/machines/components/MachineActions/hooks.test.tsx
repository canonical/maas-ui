import { useLifecycleActionEntitlements, useMachineActionMenus } from "./hooks";

import type { ExternalAuthType } from "@/app/apiclient";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { renderHookWithProviders, setupMockServer } from "@/testing/utils";

setupMockServer(authResolvers.getMeEntitlements.handler([]));

describe("useLifecycleActionEntitlements", () => {
  it.each<ExternalAuthType | null>(["RBAC", "CANDID", null])(
    "only bypasses lifecycle entitlements for RBAC (mode %s)",
    (externalAuthType) => {
      const { result } = renderHookWithProviders(
        () => ({
          details: useLifecycleActionEntitlements(true, "abc123"),
          bulk: useLifecycleActionEntitlements(false),
        }),
        {
          state: factory.rootState({
            status: factory.statusState({ externalAuthType }),
            machine: factory.machineState({
              items: [
                factory.machine({
                  system_id: "abc123",
                  pool: factory.modelRef({ id: 2 }),
                }),
                factory.machine({
                  system_id: "def456",
                  pool: factory.modelRef({ id: 3 }),
                }),
              ],
              selected: { items: ["abc123", "def456"] },
            }),
          }),
        }
      );
      const disabled = externalAuthType !== "RBAC";
      expect(result.current.details).toEqual({
        actionsDisabled: disabled,
        deployDisabled: disabled,
      });
      expect(result.current.bulk).toEqual(result.current.details);
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
