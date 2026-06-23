import { Route, Routes } from "react-router";

import UserManagement from "./UserManagement";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(authResolvers.getCurrentUser.handler());

const renderUserManagement = () =>
  renderWithProviders(
    <Routes>
      <Route element={<UserManagement />} path="/">
        <Route element={<div>Child content</div>} index />
      </Route>
    </Routes>
  );

describe("UserManagement", () => {
  it("displays a message if the user lacks the identities entitlement", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.userInfo({ entitlements: [] })
      )
    );
    renderUserManagement();

    expect(
      await screen.findByRole("heading", {
        name: /You do not have permission to view this page./,
      })
    ).toBeInTheDocument();
  });

  it("renders the content for users with the view identities entitlement", async () => {
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
    renderUserManagement();

    expect(await screen.findByText("Child content")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /You do not have permission to view this page./,
      })
    ).not.toBeInTheDocument();
  });

  it("renders the content for users with the edit identities entitlement", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.userInfo({
          entitlements: [
            factory.entitlement({
              entitlement: Entitlement.CAN_EDIT_IDENTITIES,
            }),
          ],
        })
      )
    );
    renderUserManagement();

    expect(await screen.findByText("Child content")).toBeInTheDocument();
  });

  it("does not display a permission message for users with access", async () => {
    renderUserManagement();

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /You do not have permission to view this page./,
        })
      ).not.toBeInTheDocument();
    });
  });
});
