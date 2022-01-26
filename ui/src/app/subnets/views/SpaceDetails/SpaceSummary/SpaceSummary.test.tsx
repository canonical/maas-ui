import { render, screen, within } from "@testing-library/react";

import SpaceSummary from "./SpaceSummary";

it("displays space name and description", () => {
  render(
    <SpaceSummary
      name="outer"
      description="The cold, dark, emptiness of space."
    />
  );
  const spaceSummary = screen.getByRole("region", { name: "Space summary" });

  expect(within(spaceSummary).getByText("outer")).toBeInTheDocument();
  expect(
    within(spaceSummary).getByText("The cold, dark, emptiness of space.")
  ).toBeInTheDocument();
});
