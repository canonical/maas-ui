import { screen } from "@testing-library/react";

import MachineActionButtonGroup from "./MachineActionButtonGroup";

import { renderWithBrowserRouter } from "testing/utils";

describe("MachineActionButtonGroup", () => {
  it("renders", () => {
    renderWithBrowserRouter(<MachineActionButtonGroup />);
  });

  expect(screen.getByRole("button")).toBeInTheDocument();
});
