import VisuallyHidden from "./VisuallyHidden";

import { render, screen } from "testing/utils";

it("renders children correctly", () => {
  render(<VisuallyHidden>test content</VisuallyHidden>);
  expect(screen.getByText("test content")).toBeInTheDocument();
});
