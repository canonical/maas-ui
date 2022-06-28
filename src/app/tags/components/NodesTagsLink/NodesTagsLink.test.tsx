import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

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
      <CompatRouter>
        <NodesTagsLink
          count={1}
          nodeType={MachineMeta.MODEL}
          tags={["a-tag"]}
        />
      </CompatRouter>
    </MemoryRouter>
  );
  const machineLink = screen.getByRole("link", {
    name: "1 machine",
  });
  expect(machineLink).toBeInTheDocument();
  expect(machineLink).toHaveAttribute(
    "href",
    `${machineURLs.index}?tags=%3Da-tag`
  );
});

it("create a link to controllers", () => {
  render(
    <MemoryRouter>
      <CompatRouter>
        <NodesTagsLink
          count={3}
          nodeType={ControllerMeta.MODEL}
          tags={["a-tag"]}
        />
      </CompatRouter>
    </MemoryRouter>
  );
  const controllerLink = screen.getByRole("link", {
    name: "3 controllers",
  });
  expect(controllerLink).toBeInTheDocument();
  expect(controllerLink).toHaveAttribute(
    "href",
    `${controllerURLs.index}?tags=%3Da-tag`
  );
});

it("create a link to devices", () => {
  render(
    <MemoryRouter>
      <CompatRouter>
        <NodesTagsLink count={2} nodeType={DeviceMeta.MODEL} tags={["a-tag"]} />
      </CompatRouter>
    </MemoryRouter>
  );
  const deviceLink = screen.getByRole("link", {
    name: "2 devices",
  });
  expect(deviceLink).toBeInTheDocument();
  expect(deviceLink).toHaveAttribute(
    "href",
    `${deviceURLs.index}?tags=%3Da-tag`
  );
});
