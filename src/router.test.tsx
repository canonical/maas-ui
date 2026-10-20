import { matchRoutes, useRoutes } from "react-router";

import urls from "@/app/base/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { router } from "@/router";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { poolsResolvers } from "@/testing/resolvers/pools";
import { usersResolvers } from "@/testing/resolvers/users";
import { zoneResolvers } from "@/testing/resolvers/zones";
import { renderWithProviders, screen, setupMockServer } from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  poolsResolvers.listPools.handler(),
  usersResolvers.listUsers.handler(),
  zoneResolvers.listZones.handler()
);

const machineListRoute = matchRoutes(router.routes, urls.machines.index)!.find(
  ({ route }) => route.path === urls.machines.index
)!.route;

const machineDetailsRoute = matchRoutes(
  router.routes,
  urls.machines.machine.index({ id: "abc123" })
)!.find(({ route }) => route.path === urls.machines.machine.index(null))!.route;

const MachineRoutes = () => useRoutes([machineListRoute, machineDetailsRoute]);

describe("machine list route", () => {
  it("renders the machine list with can_view_available_machines in a pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_AVAILABLE_MACHINES,
          resource_type: "pool",
          resource_id: 2,
        }),
      ])
    );
    renderWithProviders(<MachineRoutes />, {
      initialEntries: [urls.machines.index],
    });

    expect(
      await screen.findByRole("searchbox", { name: "Search" })
    ).toBeInTheDocument();
  });
});

describe("machine details route", () => {
  it("shows not found for an inaccessible machine with can_view_available_machines", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_AVAILABLE_MACHINES,
          resource_type: "pool",
          resource_id: 2,
        }),
      ])
    );
    const state = factory.rootState({
      machine: factory.machineState({
        errors: "Machine matching query does not exist.",
      }),
    });
    renderWithProviders(<MachineRoutes />, {
      initialEntries: [urls.machines.machine.summary({ id: "abc123" })],
      state,
    });

    expect(
      await screen.findByRole("heading", { name: "Machine not found" })
    ).toBeInTheDocument();
  });
});
