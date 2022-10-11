import { screen } from "@testing-library/react";

import VaultSettings, { Labels as VaultSettingsLabels } from "./VaultSettings";

import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import { NodeType } from "app/store/types/node";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("VaultSettings", () => {
  let controllers: Controller[];
  let state: RootState;
  beforeEach(() => {
    controllers = [
      controllerDetailsFactory({
        fqdn: "testcontroller1",
        node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        system_id: "abc123",
        vault_configured: false,
      }),
      controllerDetailsFactory({
        fqdn: "testcontroller2",
        node_type: NodeType.REGION_CONTROLLER,
        system_id: "def456",
        vault_configured: false,
      }),
    ];
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: controllers,
      }),
    });
  });

  it("displays a spinner while loading controllers", () => {
    state.controller.loaded = false;
    renderWithMockStore(<VaultSettings />, { state });

    expect(screen.getByText(VaultSettingsLabels.Loading)).toBeInTheDocument();
  });

  it("displays the vault setup instructions if Vault is not configured on any controllers", () => {
    renderWithMockStore(<VaultSettings />, { state });

    expect(
      screen.getByText(VaultSettingsLabels.IntegrateWithVault)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: VaultSettingsLabels.SetupInstructions })
    ).toBeInTheDocument();
  });

  it("displays the vault setup instructions a warning if vault is not configured on all controllers", () => {
    const controllers = [
      controllerDetailsFactory({
        fqdn: "testcontroller1",
        node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        system_id: "abc123",
        vault_configured: true,
      }),
      controllerDetailsFactory({
        fqdn: "testcontroller2",
        node_type: NodeType.REGION_CONTROLLER,
        system_id: "def456",
        vault_configured: false,
      }),
    ];

    state.controller.items = controllers;

    renderWithMockStore(<VaultSettings />, { state });

    expect(
      screen.getByText(
        "Incomplete vault integration, configure 1 other controller with Vault to complete this operation."
      )
    );
    expect(
      screen.getByRole("list", { name: VaultSettingsLabels.SetupInstructions })
    ).toBeInTheDocument();
  });

  it("displays 'Vault enabled' and hides setup instructions if Vault is configured on all controllers", () => {
    const controllers = [
      controllerDetailsFactory({
        fqdn: "testcontroller1",
        node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        system_id: "abc123",
        vault_configured: true,
      }),
      controllerDetailsFactory({
        fqdn: "testcontroller2",
        node_type: NodeType.REGION_CONTROLLER,
        system_id: "def456",
        vault_configured: true,
      }),
    ];

    state.controller.items = controllers;

    renderWithMockStore(<VaultSettings />, { state });

    expect(
      screen.getByText(VaultSettingsLabels.VaultEnabled)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("list", {
        name: VaultSettingsLabels.SetupInstructions,
      })
    ).not.toBeInTheDocument();
  });
});
