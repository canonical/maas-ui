import { Route, Routes } from "react-router";

import Pools from "./Pools";

import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

const renderPools = () =>
  renderWithProviders(
    <Routes>
      <Route element={<Pools />} path="/">
        <Route element={<div>Child content</div>} index />
      </Route>
    </Routes>
  );

describe("Pools", () => {
  it("displays a message if the user lacks the global entities entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderPools();

    expect(
      await screen.findByRole("heading", {
        name: /You do not have permission to view this page./,
      })
    ).toBeInTheDocument();
  });

  it("does not display a permission message for users with access", async () => {
    renderPools();

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /You do not have permission to view this page./,
        })
      ).not.toBeInTheDocument();
    });
  });
});
