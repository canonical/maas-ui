import ShowAdvanced, { Labels } from "./ShowAdvanced";

import { render, screen, userEvent } from "testing/utils";

it("displays additional content on press", async () => {
  render(<ShowAdvanced>additional content</ShowAdvanced>);

  expect(screen.getByText("additional content")).toHaveAttribute(
    "aria-hidden",
    "true"
  );
  await userEvent.click(
    screen.getByRole("button", { name: Labels.ShowAdvanced })
  );
  expect(screen.getByText("additional content")).toHaveAttribute(
    "aria-hidden",
    "false"
  );
});
