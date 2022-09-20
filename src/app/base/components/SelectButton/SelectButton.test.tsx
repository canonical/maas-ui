import { render, screen } from "@testing-library/react";

import SelectButton from "./SelectButton";

it("displays a button", () => {
  render(<SelectButton>Test</SelectButton>);

  expect(screen.getByRole("button", { name: "Test" })).toBeInTheDocument();
});
