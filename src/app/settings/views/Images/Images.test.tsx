import { Route, Routes } from "react-router";

import Images from "./Images";

import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(authResolvers.getCurrentUser.handler());

const renderImages = () =>
  renderWithProviders(
    <Routes>
      <Route element={<Images />} path="/">
        <Route element={<div>Child content</div>} index />
      </Route>
    </Routes>
  );

describe("Images", () => {
  it("displays a message if the user lacks the boot entities entitlement", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.userInfo({ entitlements: [] })
      )
    );
    renderImages();

    expect(
      await screen.findByRole("heading", {
        name: /You do not have permission to view this page./,
      })
    ).toBeInTheDocument();
  });

  it("does not display a permission message for users with access", async () => {
    renderImages();

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /You do not have permission to view this page./,
        })
      ).not.toBeInTheDocument();
    });
  });
});
