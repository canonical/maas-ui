import { screen } from "@testing-library/react";

import VaultSettings, { Labels as VaultSettingsLabels } from "./VaultSettings";

import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import { NodeType } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
  vaultEnabledState as vaultEnabledStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("VaultSettings", () => {
  let controllers: Controller[];
  let state: RootState;
  beforeEach(() => {
    controllers = [
      controllerFactory({
        fqdn: "testcontroller1",
        node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        system_id: "abc123",
        vault_configured: false,
      }),
      controllerFactory({
        fqdn: "testcontroller2",
        node_type: NodeType.REGION_CONTROLLER,
        system_id: "def456",
        vault_configured: false,
      }),
    ];
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        loading: false,
        items: controllers,
      }),
      general: generalStateFactory({
        vaultEnabled: vaultEnabledStateFactory({
          data: false,
          loaded: true,
        }),
      }),
    });
  });

  it("displays a spinner while loading", () => {
    state.controller.loaded = false;
    state.controller.loading = true;
    state.general.vaultEnabled.loaded = false;

    renderWithMockStore(<VaultSettings />, { state });

    expect(screen.getByText(VaultSettingsLabels.Loading)).toBeInTheDocument();
  });

  it("displays the vault setup instructions if Vault is not configured on any controllers", () => {
    renderWithMockStore(<VaultSettings />, { state });

    expect(
      screen.getByText(VaultSettingsLabels.IntegrateWithVault)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(VaultSettingsLabels.IntegrateWithVault)
    ).toBeInTheDocument();
  });

  it("displays the vault setup instructions a warning if vault is not configured on all controllers", () => {
    controllers[0].vault_configured = true;
    state.controller.items = controllers;

    renderWithMockStore(<VaultSettings />, { state });

    expect(
      screen.getByText(
        /Incomplete Vault integration, configure 1 other controller with Vault to complete this operation./
      )
    );
    expect(
      screen.getByLabelText(
        /Incomplete Vault integration, configure 1 other controller with Vault to complete this operation./
      )
    ).toBeInTheDocument();
  });

  it("displays only the secret migration instruction if all controllers are set up but secrets are not migrated", () => {
    controllers[0].vault_configured = true;
    controllers[1].vault_configured = true;
    state.controller.items = controllers;

    renderWithMockStore(<VaultSettings />, { state });

    expect(
      screen.getByText(VaultSettingsLabels.SecretMigrationInstructions)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(VaultSettingsLabels.SecretMigrationInstructions)
    ).toBeInTheDocument();
  });

  it("displays 'Vault enabled' and hides setup instructions if Vault is configured on all controllers", () => {
    controllers[0].vault_configured = true;
    controllers[1].vault_configured = true;
    state.controller.items = controllers;
    state.general.vaultEnabled.data = true;

    renderWithMockStore(<VaultSettings />, { state });

    expect(
      screen.getByText(VaultSettingsLabels.VaultEnabled)
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(VaultSettingsLabels.SetupInstructions)
    ).not.toBeInTheDocument();
  });
});
