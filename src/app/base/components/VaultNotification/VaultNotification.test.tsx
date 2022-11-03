import { screen } from "@testing-library/react";

import VaultNotification from "./VaultNotification";

import { rootState as rootStateFactory } from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

it("does not display a notification when data has not loaded", async () => {
  const state = rootStateFactory();
  state.controller.loaded = false;
  renderWithBrowserRouter(<VaultNotification />, {
    state,
  });
  expect(
    screen.queryByText(/Incomplete Vault integration/)
  ).not.toBeInTheDocument();
});

it("displays a notification when data has loaded", async () => {
  const state = rootStateFactory();
  state.controller.loaded = true;
  state.general.vaultEnabled.loaded = true;
  renderWithBrowserRouter(<VaultNotification />, {
    state,
  });
  expect(screen.getByText(/Incomplete Vault integration/)).toBeInTheDocument();
});
