import { render, screen } from "@testing-library/react";

import SpaceDetailsHeader from "./SpaceDetailsHeader";

import { space as spaceFactory } from "testing/factories";

it("shows the space name as the section title", () => {
  const space = spaceFactory({ id: 1, name: "space-1" });
  render(<SpaceDetailsHeader space={space} />);

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "space-1"
  );
});
