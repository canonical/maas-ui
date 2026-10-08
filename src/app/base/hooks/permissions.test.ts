import {
  useCanEditMachine,
  useCanEditVMHost,
  useHasEntitlements,
  useIsSuperUser,
} from "./permissions";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import type { ExternalAuthType } from "@/app/apiclient";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(authResolvers.getMeEntitlements.handler([]));

const usePermissionResults = () => ({
  canView: useHasEntitlements([Entitlement.CAN_VIEW_MACHINES]),
  canEditMachine: useCanEditMachine("abc123"),
  canEditUnresolvedMachine: useCanEditMachine(),
  canEditVMHost: useCanEditVMHost(0),
  canEditUnresolvedVMHost: useCanEditVMHost(),
  isSuperUser: useIsSuperUser(),
  query: useGetUserEntitlements(),
});

describe("entitlement gates", () => {
  it.each<ExternalAuthType | null>(["RBAC", "CANDID", null])(
    "handles missing entitlements for auth type %s",
    async (externalAuthType) => {
      const { result } = renderHookWithProviders(usePermissionResults, {
        state: factory.rootState({
          status: factory.statusState({ externalAuthType }),
          machine: factory.machineState({
            items: [
              factory.machine({
                system_id: "abc123",
                pool: factory.modelRef({ id: 2 }),
              }),
            ],
          }),
          pod: factory.podState({
            items: [factory.pod({ id: 0, pool: 2 })],
          }),
        }),
      });

      if (externalAuthType !== "RBAC") {
        await waitFor(() => {
          expect(result.current.query.isSuccess).toBe(true);
        });
      }
      const allowed = externalAuthType === "RBAC";
      expect(result.current).toMatchObject({
        canView: allowed,
        canEditMachine: allowed,
        canEditUnresolvedMachine: allowed,
        canEditVMHost: allowed,
        canEditUnresolvedVMHost: allowed,
        isSuperUser: false,
      });
    }
  );

  it.each([2, 3])(
    "retains pool-scoped editing checks for non-RBAC users in pool %s",
    async (poolId) => {
      mockServer.use(
        authResolvers.getMeEntitlements.handler([
          factory.entitlement({
            entitlement: Entitlement.CAN_EDIT_MACHINES,
            resource_type: "pool",
            resource_id: 2,
          }),
        ])
      );
      const { result } = renderHookWithProviders(usePermissionResults, {
        state: factory.rootState({
          machine: factory.machineState({
            items: [
              factory.machine({
                system_id: "abc123",
                pool: factory.modelRef({ id: poolId }),
              }),
            ],
          }),
          pod: factory.podState({
            items: [factory.pod({ id: 0, pool: poolId })],
          }),
        }),
      });
      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true);
      });
      expect(result.current.canView).toBe(true);
      expect(result.current.canEditMachine).toBe(poolId === 2);
      expect(result.current.canEditVMHost).toBe(poolId === 2);
    }
  );

  it("still recognises non-RBAC superuser entitlements", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler(factory.userEntitlements())
    );
    const { result } = renderHookWithProviders(useIsSuperUser);
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
