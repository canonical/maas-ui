import SelectButton from "./SelectButton";

import { render, screen } from "testing/utils";

it("displays a button", () => {
  render(<SelectButton>Test</SelectButton>);

  expect(screen.getByRole("button", { name: "Test" })).toBeInTheDocument();
});
