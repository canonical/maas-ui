import { screen } from "@testing-library/react";

import VaultNotification from "./VaultNotification";

import { NodeType } from "app/store/types/node";
import {
  rootState as rootStateFactory,
  controller as controllerFactory,
} from "testing/factories";
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

it("displays a notification when data has loaded and not all controllers are configured", async () => {
  const state = rootStateFactory();
  state.controller.loaded = true;
  state.general.vaultEnabled.loaded = true;
  state.general.vaultEnabled.data = false;
  state.controller.items = [
    controllerFactory({
      vault_configured: false,
      node_type: NodeType.REGION_AND_RACK_CONTROLLER,
    }),
    controllerFactory({
      vault_configured: true,
      node_type: NodeType.REGION_CONTROLLER,
    }),
  ];
  renderWithBrowserRouter(<VaultNotification />, {
    state,
  });
  expect(screen.getByText(/Incomplete Vault integration/)).toBeInTheDocument();
});

it("displays a notification when data has loaded and secrets are not migrated to Vault", async () => {
  const state = rootStateFactory();
  state.controller.loaded = true;
  state.general.vaultEnabled.loaded = true;
  state.general.vaultEnabled.data = false;
  state.controller.items = [
    controllerFactory({
      vault_configured: true,
      node_type: NodeType.REGION_AND_RACK_CONTROLLER,
    }),
    controllerFactory({
      vault_configured: true,
      node_type: NodeType.REGION_CONTROLLER,
    }),
  ];
  renderWithBrowserRouter(<VaultNotification />, {
    state,
  });
  expect(screen.getByText(/Incomplete Vault integration/)).toBeInTheDocument();
});

it("doesn't display a notification if vault setup is complete", async () => {
  const state = rootStateFactory();
  state.controller.loaded = true;
  state.general.vaultEnabled.loaded = true;
  state.general.vaultEnabled.data = true;
  state.controller.items = [
    controllerFactory({
      vault_configured: true,
      node_type: NodeType.REGION_AND_RACK_CONTROLLER,
    }),
    controllerFactory({
      vault_configured: true,
      node_type: NodeType.REGION_CONTROLLER,
    }),
  ];
  renderWithBrowserRouter(<VaultNotification />, {
    state,
  });
  expect(
    screen.queryByText(/Incomplete Vault integration/)
  ).not.toBeInTheDocument();
});

it("doesn't display a notification if vault setup has not been started", async () => {
  const state = rootStateFactory();
  state.controller.loaded = true;
  state.general.vaultEnabled.loaded = true;
  state.general.vaultEnabled.data = false;
  state.controller.items = [
    controllerFactory({
      vault_configured: false,
      node_type: NodeType.REGION_AND_RACK_CONTROLLER,
    }),
    controllerFactory({
      vault_configured: false,
      node_type: NodeType.REGION_CONTROLLER,
    }),
  ];
  renderWithBrowserRouter(<VaultNotification />, {
    state,
  });
  expect(
    screen.queryByText(/Incomplete Vault integration/)
  ).not.toBeInTheDocument();
});
