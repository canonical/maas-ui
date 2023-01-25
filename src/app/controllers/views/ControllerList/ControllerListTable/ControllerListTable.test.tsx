import ControllerListTable from "./ControllerListTable";

import urls from "app/base/urls";
import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import { NodeType } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVersions as controllerVersionsFactory,
  rootState as rootStateFactory,
  vaultEnabledState as vaultEnabledStateFactory,
} from "testing/factories";
import {
  userEvent,
  screen,
  within,
  renderWithBrowserRouter,
} from "testing/utils";

describe("ControllerListTable", () => {
  let controller: Controller;
  let state: RootState;
  beforeEach(() => {
    controller = controllerFactory();
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [controller],
      }),
    });
  });

  it("links to a controller's details page", () => {
    controller.system_id = "def456";
    renderWithBrowserRouter(
      <ControllerListTable
        controllers={[controller]}
        onSelectedChange={jest.fn()}
        selectedIDs={[]}
      />,
      { state }
    );

    expect(screen.getAllByRole("link")[0]).toHaveProperty(
      "href",
      `http://example.com${urls.controllers.controller.index({
        id: controller.system_id,
      })}`
    );
  });

  describe("controller list sorting", () => {
    it("can sort by FQDN", async () => {
      const controllers = [
        controllerFactory({ fqdn: "b", system_id: "b" }),
        controllerFactory({ fqdn: "c", system_id: "c" }),
        controllerFactory({ fqdn: "a", system_id: "a" }),
      ];
      renderWithBrowserRouter(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={jest.fn()}
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
      await userEvent.click(screen.getByRole("button", { name: "Name" }));
      rows = screen.getAllByRole("row");
      expect(rows[1]).toStrictEqual(screen.getByTestId("controller-c"));
      expect(rows[2]).toStrictEqual(screen.getByTestId("controller-b"));
      expect(rows[3]).toStrictEqual(screen.getByTestId("controller-a"));
    });

    it("can sort by version", async () => {
      const controllers = [
        controllerFactory({
          versions: controllerVersionsFactory({ origin: "3" }),
          system_id: "c",
        }),
        controllerFactory({
          versions: controllerVersionsFactory({ origin: "1" }),
          system_id: "a",
        }),
        controllerFactory({
          versions: controllerVersionsFactory({ origin: "2" }),
          system_id: "b",
        }),
      ];
      renderWithBrowserRouter(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={jest.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      // Change sort to descending version
      await userEvent.click(screen.getByRole("button", { name: "Version" }));

      var rows = screen.getAllByRole("row");
      expect(rows[1]).toStrictEqual(screen.getByTestId("controller-a"));
      expect(rows[2]).toStrictEqual(screen.getByTestId("controller-b"));
      expect(rows[3]).toStrictEqual(screen.getByTestId("controller-c"));

      // Change sort to ascending version
      await userEvent.click(screen.getByRole("button", { name: "Version" }));

      rows = screen.getAllByRole("row");
      expect(rows[1]).toStrictEqual(screen.getByTestId("controller-c"));
      expect(rows[2]).toStrictEqual(screen.getByTestId("controller-b"));
      expect(rows[3]).toStrictEqual(screen.getByTestId("controller-a"));
    });
  });

  describe("controller selection", () => {
    it("handles selecting a single controller", async () => {
      const controllers = [controllerFactory({ system_id: "abc123" })];
      const onSelectedChange = jest.fn();
      renderWithBrowserRouter(
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
      const controllers = [controllerFactory({ system_id: "abc123" })];
      const onSelectedChange = jest.fn();
      renderWithBrowserRouter(
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
        controllerFactory({ system_id: "abc123" }),
        controllerFactory({ system_id: "def456" }),
      ];
      const onSelectedChange = jest.fn();
      renderWithBrowserRouter(
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
        controllerFactory({ system_id: "abc123" }),
        controllerFactory({ system_id: "def456" }),
      ];
      const onSelectedChange = jest.fn();
      renderWithBrowserRouter(
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
        controllerFactory({ system_id: "abc123" }),
        controllerFactory({ system_id: "def456" }),
      ];
      state.controller.items = controllers;
      renderWithBrowserRouter(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={jest.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      expect(screen.queryByTestId("vault-icon")).not.toBeInTheDocument();
    });

    it("shows icons with appropriate tooltips based on vault status for each controller", () => {
      const controllers = [
        controllerFactory({
          system_id: "abc123",
          vault_configured: true,
          node_type: NodeType.REGION_CONTROLLER,
        }),
        controllerFactory({
          system_id: "def456",
          vault_configured: false,
          node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        }),
      ];
      state.controller.items = controllers;

      renderWithBrowserRouter(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={jest.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      const rows = screen.getAllByRole("row");

      expect(within(rows[1]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security"
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

    it("displays a security-tick with appropriate tooltip on controllers once they are all configured and vault is enabled", () => {
      const controllers = [
        controllerFactory({
          system_id: "abc123",
          vault_configured: true,
          node_type: NodeType.REGION_CONTROLLER,
        }),
        controllerFactory({
          system_id: "def456",
          vault_configured: true,
          node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        }),
      ];
      state.controller.items = controllers;
      state.general = generalStateFactory({
        vaultEnabled: vaultEnabledStateFactory({
          data: true,
          loaded: true,
        }),
      });

      renderWithBrowserRouter(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={jest.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      const rows = screen.getAllByRole("row");
      const tooltips = screen.getAllByRole("tooltip", {
        name: "Vault is configured on this region controller for secret storage. Read more about Vault integration",
      });

      expect(within(rows[1]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security-tick"
      );
      expect(tooltips[0]).toBeInTheDocument();

      expect(within(rows[2]).getByTestId("vault-icon")).toHaveClass(
        "p-icon--security-tick"
      );
      expect(tooltips[1]).toBeInTheDocument();
    });

    it("does not show vault icons on rack controllers", () => {
      const controllers = [
        controllerFactory({
          system_id: "abc123",
          vault_configured: true,
          node_type: NodeType.REGION_CONTROLLER,
        }),
        controllerFactory({
          system_id: "def456",
          vault_configured: true,
          node_type: NodeType.REGION_AND_RACK_CONTROLLER,
        }),
        controllerFactory({
          system_id: "ghi789",
          vault_configured: true,
          node_type: NodeType.RACK_CONTROLLER,
        }),
      ];
      state.controller.items = controllers;
      state.general = generalStateFactory({
        vaultEnabled: vaultEnabledStateFactory({
          data: true,
          loaded: true,
        }),
      });

      renderWithBrowserRouter(
        <ControllerListTable
          controllers={controllers}
          onSelectedChange={jest.fn()}
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
});
