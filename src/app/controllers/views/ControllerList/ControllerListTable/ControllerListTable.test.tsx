import ControllerListTable, { Label } from "./ControllerListTable";

import urls from "@/app/base/urls";
import type { Controller } from "@/app/store/controller/types";
import type { RootState } from "@/app/store/root/types";
import { NodeType } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import {
  renderWithProviders,
  screen,
  userEvent,
  within,
} from "@/testing/utils";

describe("ControllerListTable", () => {
  let controller: Controller;
  let state: RootState;
  beforeEach(() => {
    controller = factory.controller();
    state = factory.rootState({
      controller: factory.controllerState({
        loaded: true,
        items: [controller],
      }),
    });
  });

  it("links to a controller's details page", () => {
    controller.system_id = "def456";
    renderWithProviders(
      <ControllerListTable
        controllers={[controller]}
        onSelectedChange={vi.fn()}
        selectedIDs={[]}
      />,
      { state }
    );

    expect(screen.getAllByRole("link")[0]).toHaveAttribute(
      "href",
      urls.controllers.controller.index({
        id: controller.system_id,
      })
    );
  });

  describe("controller list sorting", () => {
    it("can sort by FQDN", async () => {
      const controllers = [
        factory.controller({ fqdn: "b", system_id: "b" }),
        factory.controller({ fqdn: "c", system_id: "c" }),
        factory.controller({ fqdn: "a", system_id: "a" }),
      ];
      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={vi.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      let rows = screen.getAllByRole("row");

      // Table is sorted be descending FQDN by default
      expect(rows[1]).toStrictEqual(screen.getByTestId("controller-a"));
      expect(rows[2]).toStrictEqual(screen.getByTestId("controller-b"));
      expect(rows[3]).toStrictEqual(screen.getByTestId("controller-c"));

      // Change sort to ascending FQDN
      await userEvent.click(
        screen.getByRole("button", { name: "Name (descending)" })
      );
      rows = screen.getAllByRole("row");
      expect(rows[1]).toStrictEqual(screen.getByTestId("controller-c"));
      expect(rows[2]).toStrictEqual(screen.getByTestId("controller-b"));
      expect(rows[3]).toStrictEqual(screen.getByTestId("controller-a"));
    });

    it("can sort by version", async () => {
      const controllers = [
        factory.controller({
          versions: factory.controllerVersions({ origin: "3" }),
          system_id: "c",
        }),
        factory.controller({
          versions: factory.controllerVersions({ origin: "1" }),
          system_id: "a",
        }),
        factory.controller({
          versions: factory.controllerVersions({ origin: "2" }),
          system_id: "b",
        }),
      ];
      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={vi.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      // Change sort to descending version
      await userEvent.click(screen.getByRole("button", { name: "Version" }));

      let rows = screen.getAllByRole("row");
      expect(rows[1]).toStrictEqual(screen.getByTestId("controller-a"));
      expect(rows[2]).toStrictEqual(screen.getByTestId("controller-b"));
      expect(rows[3]).toStrictEqual(screen.getByTestId("controller-c"));

      // Change sort to ascending version
      await userEvent.click(
        screen.getByRole("button", { name: "Version (descending)" })
      );

      rows = screen.getAllByRole("row");
      expect(rows[1]).toStrictEqual(screen.getByTestId("controller-c"));
      expect(rows[2]).toStrictEqual(screen.getByTestId("controller-b"));
      expect(rows[3]).toStrictEqual(screen.getByTestId("controller-a"));
    });
  });

  describe("controller selection", () => {
    it("handles selecting a single controller", async () => {
      const controllers = [factory.controller({ system_id: "abc123" })];
      const onSelectedChange = vi.fn();
      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={onSelectedChange}
          selectedIDs={[]}
        />,
        { state }
      );

      await userEvent.click(screen.getAllByTestId("controller-checkbox")[0]);

      expect(onSelectedChange).toHaveBeenCalledWith(["abc123"]);
    });

    it("handles unselecting a single controller", async () => {
      const controllers = [factory.controller({ system_id: "abc123" })];
      const onSelectedChange = vi.fn();
      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={onSelectedChange}
          selectedIDs={["abc123"]}
        />,
        { state }
      );

      await userEvent.click(screen.getAllByTestId("controller-checkbox")[0]);

      expect(onSelectedChange).toHaveBeenCalledWith([]);
    });

    it("handles selecting all controllers", async () => {
      const controllers = [
        factory.controller({ system_id: "abc123" }),
        factory.controller({ system_id: "def456" }),
      ];
      const onSelectedChange = vi.fn();
      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={onSelectedChange}
          selectedIDs={[]}
        />,
        { state }
      );

      await userEvent.click(screen.getByTestId("all-controllers-checkbox"));

      expect(onSelectedChange).toHaveBeenCalledWith(["abc123", "def456"]);
    });

    it("handles unselecting all controllers", async () => {
      const controllers = [
        factory.controller({ system_id: "abc123" }),
        factory.controller({ system_id: "def456" }),
      ];
      const onSelectedChange = vi.fn();
      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={onSelectedChange}
          selectedIDs={["abc123", "def456"]}
        />,
        { state }
      );

      await userEvent.click(screen.getByTestId("all-controllers-checkbox"));

      expect(onSelectedChange).toHaveBeenCalledWith([]);
    });
  });

  describe("vault status icons", () => {
    it("shows no icons by default", () => {
      const controllers = [
        factory.controller({ system_id: "abc123" }),
        factory.controller({ system_id: "def456" }),
      ];
      state.controller.items = controllers;
      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={vi.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      expect(screen.queryByTestId("vault-icon")).not.toBeInTheDocument();
    });

    it("shows icons with appropriate tooltips based on vault status for each controller", async () => {
      const controllers = [
        factory.controller({
          system_id: "abc123",
          vault_configured: true,
          node_type: NodeType.REGION_CONTROLLER,
        }),
        factory.controller({
          system_id: "def456",
          vault_configured: false,
          node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        }),
      ];
      state.controller.items = controllers;

      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={vi.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      const rows = screen.getAllByRole("row");

      expect(within(rows[1]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security"
      );
      await userEvent.click(
        within(rows[1]).getByRole("button", { name: /security/i })
      );
      expect(
        within(rows[1]).getByTestId("vault-icon")
      ).toHaveAccessibleDescription(
        "Vault is configured on this controller. Once all controllers are configured, migrate the secrets. Read more about Vault integration"
      );
      expect(
        screen.getByRole("tooltip", {
          name: "Vault is configured on this controller. Once all controllers are configured, migrate the secrets. Read more about Vault integration",
        })
      ).toBeInTheDocument();

      expect(within(rows[2]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security-warning"
      );
      await userEvent.click(within(rows[2]).getByRole("button"));
      expect(
        within(rows[2]).getByTestId("vault-icon")
      ).toHaveAccessibleDescription(
        "Missing Vault configuration. Read more about Vault integration"
      );
      expect(
        screen.getByRole("tooltip", {
          name: "Missing Vault configuration. Read more about Vault integration",
        })
      ).toBeInTheDocument();
    });

    it("displays a security-tick with appropriate tooltip on controllers once they are all configured and vault is enabled", async () => {
      const controllers = [
        factory.controller({
          system_id: "abc123",
          vault_configured: true,
          node_type: NodeType.REGION_CONTROLLER,
        }),
        factory.controller({
          system_id: "def456",
          vault_configured: true,
          node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        }),
      ];
      state.controller.items = controllers;
      state.general = factory.generalState({
        vaultEnabled: factory.vaultEnabledState({
          data: true,
          loaded: true,
        }),
      });

      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={vi.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      const rows = screen.getAllByRole("row");
      await userEvent.click(
        screen.getAllByRole("button", { name: /security/i })[0]
      );
      expect(
        screen.getAllByRole("tooltip", {
          name: "Vault is configured on this region controller for secret storage. Read more about Vault integration",
        })[0]
      ).toBeInTheDocument();
      expect(within(rows[1]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security-tick"
      );
      expect(within(rows[2]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security-tick"
      );
    });

    it("does not show vault icons on rack controllers", () => {
      const controllers = [
        factory.controller({
          system_id: "abc123",
          vault_configured: true,
          node_type: NodeType.REGION_CONTROLLER,
        }),
        factory.controller({
          system_id: "def456",
          vault_configured: true,
          node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        }),
        factory.controller({
          system_id: "ghi789",
          vault_configured: true,
          node_type: NodeType.RACK_CONTROLLER,
        }),
      ];
      state.controller.items = controllers;
      state.general = factory.generalState({
        vaultEnabled: factory.vaultEnabledState({
          data: true,
          loaded: true,
        }),
      });

      renderWithProviders(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={vi.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      const rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security-tick"
      );

      expect(within(rows[2]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security-tick"
      );

      expect(
        within(rows[3]).queryByTestId("vault-icon")
      ).not.toBeInTheDocument();
    });
  });

  it("displays message for empty state", () => {
    renderWithProviders(
      <ControllerListTable
        controllers={[]}
        onSelectedChange={vi.fn()}
        selectedIDs={[]}
      />,
      { state }
    );

    expect(screen.getByText(Label.EmptyList)).toBeInTheDocument();
  });
});
