import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SpaceDetailsHeader from "./SpaceDetailsHeader";

import { space as spaceFactory } from "testing/factories";

it("shows the space name as the section title", () => {
  const space = spaceFactory({ id: 1, name: "space-1" });
  render(<SpaceDetailsHeader space={space} />);

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "space-1"
  );
});

it("displays a delete confirmation before delete", () => {
  const space = spaceFactory({ id: 1, name: "space-1" });
  render(<SpaceDetailsHeader space={space} />);
  userEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(
    screen.getByText("Are you sure you want to delete space-1 space?")
  ).toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "Yes, delete space" }));
  expect(
    screen.queryByText("Are you sure you want to delete space-1 space?")
  ).not.toBeInTheDocument();
});

// it("displays a warning if there are any subnets on the space.", () => {});
