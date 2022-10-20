import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ControllerListTable from "./ControllerListTable";

import urls from "app/base/urls";
import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVersions as controllerVersionsFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

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
      { wrapperProps: { state } }
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
        { wrapperProps: { state } }
      );

      var rows = screen.getAllByRole("row");

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
        { wrapperProps: { state } }
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
        { wrapperProps: { state } }
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
        { wrapperProps: { state } }
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
        { wrapperProps: { state } }
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
        { wrapperProps: { state } }
      );

      await userEvent.click(screen.getByTestId("all-controllers-checkbox"));

      expect(onSelectedChange).toHaveBeenCalledWith([]);
    });
  });
});
