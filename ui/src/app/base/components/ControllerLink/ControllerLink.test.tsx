import { generateLegacyURL } from "@maas-ui/maas-ui-shared";
import { render, screen } from "@testing-library/react";

import ControllerLink from "./ControllerLink";

import baseURLs from "app/base/urls";
import { controller as controllerFactory, modelRef } from "testing/factories";

const controller = controllerFactory({
  hostname: "bolla",
  system_id: "1234",
  domain: modelRef({ name: "maas" }),
});
it("displays a correct link", () => {
  render(<ControllerLink {...controller} />);
  const link = screen.getByRole("link");
  expect(link).toHaveTextContent("bolla.maas");
  expect(link).toHaveAttribute(
    "href",
    generateLegacyURL(baseURLs.controller({ id: controller.system_id }))
  );
});
