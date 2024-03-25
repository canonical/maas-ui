import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import NodesTagsLink from "./NodesTagsLink";

import urls from "@/app/base/urls";
import { ControllerMeta } from "@/app/store/controller/types";
import { DeviceMeta } from "@/app/store/device/types";
import { MachineMeta } from "@/app/store/machine/types";
import { render, screen } from "@/testing/utils";

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
    `${urls.machines.index}?tags=%3Da-tag`
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
    `${urls.controllers.index}?tags=%3Da-tag`
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
    `${urls.devices.index}?tags=%3Da-tag`
  );
});
