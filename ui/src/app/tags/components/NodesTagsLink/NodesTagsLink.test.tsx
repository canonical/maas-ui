import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import NodesTagsLink from "./NodesTagsLink";

import controllerURLs from "app/controllers/urls";
import deviceURLs from "app/devices/urls";
import machineURLs from "app/machines/urls";
import { ControllerMeta } from "app/store/controller/types";
import { DeviceMeta } from "app/store/device/types";
import { MachineMeta } from "app/store/machine/types";

it("create a link to machines", () => {
  render(
    <MemoryRouter>
      <NodesTagsLink count={1} nodeType={MachineMeta.MODEL} tags={["a-tag"]} />
    </MemoryRouter>
  );
  const machineLink = screen.getByRole("link", {
    name: "1 machine",
  });
  expect(machineLink).toBeInTheDocument();
  expect(machineLink).toHaveAttribute(
    "href",
    `${machineURLs.machines.index}?tags==a-tag`
  );
});

it("create a link to controllers", () => {
  render(
    <MemoryRouter>
      <NodesTagsLink
        count={3}
        nodeType={ControllerMeta.MODEL}
        tags={["a-tag"]}
      />
    </MemoryRouter>
  );
  const controllerLink = screen.getByRole("link", {
    name: "3 controllers",
  });
  expect(controllerLink).toBeInTheDocument();
  expect(controllerLink).toHaveAttribute(
    "href",
    `${controllerURLs.controllers.index}?tags==a-tag`
  );
});

it("create a link to devices", () => {
  render(
    <MemoryRouter>
      <NodesTagsLink count={2} nodeType={DeviceMeta.MODEL} tags={["a-tag"]} />
    </MemoryRouter>
  );
  const deviceLink = screen.getByRole("link", {
    name: "2 devices",
  });
  expect(deviceLink).toBeInTheDocument();
  expect(deviceLink).toHaveAttribute(
    "href",
    `${deviceURLs.devices.index}?tags==a-tag`
  );
});
