import { Route, Routes } from "react-router";

import GroupDetails from "./GroupDetails";

import urls from "@/app/settings/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { groupsResolvers } from "@/testing/resolvers/groups";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  groupsResolvers.getGroup.handler(),
  groupsResolvers.listGroupsStatistics.handler(),
  groupsResolvers.listGroupEntitlements.handler(),
  groupsResolvers.listGroupMembers.handler(),
  poolsResolvers.getPool.handler(),
  authResolvers.getCurrentUser.handler()
);

describe("GroupDetails", () => {
  it("redirects from the index route to the entitlements tab", async () => {
    const { router } = renderWithProviders(
      <Routes>
        <Route
          element={<GroupDetails />}
          path={`${urls.userManagement.group.index(null)}/*`}
        />
      </Routes>,
      { initialEntries: [urls.userManagement.group.index({ id: 1 })] }
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        urls.userManagement.group.entitlements({ id: 1 })
      );
    });
  });

  it("renders the members tab content on the members route", async () => {
    renderWithProviders(
      <Routes>
        <Route
          element={<GroupDetails />}
          path={`${urls.userManagement.group.index(null)}/*`}
        />
      </Routes>,
      { initialEntries: [urls.userManagement.group.members({ id: 1 })] }
    );

    await waitFor(() => {
      expect(
        screen.getByRole("columnheader", { name: /username/i })
      ).toBeInTheDocument();
    });
  });

  it("disables group actions without edit permissions", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.userInfo({
          entitlements: [
            factory.entitlement({
              entitlement: Entitlement.CAN_VIEW_IDENTITIES,
            }),
          ],
        })
      )
    );

    renderWithProviders(
      <Routes>
        <Route
          element={<GroupDetails />}
          path={`${urls.userManagement.group.index(null)}/*`}
        />
      </Routes>,
      { initialEntries: [urls.userManagement.group.entitlements({ id: 1 })] }
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add entitlement" })
      ).toBeAriaDisabled();
    });
    expect(
      screen.getByRole("button", { name: "Take action" })
    ).toBeAriaDisabled();
  });
});
