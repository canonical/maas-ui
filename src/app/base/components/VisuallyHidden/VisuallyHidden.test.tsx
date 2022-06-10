import { render, screen } from "@testing-library/react";

import VisuallyHidden from "./VisuallyHidden";

it("renders children correctly", () => {
  render(<VisuallyHidden>test content</VisuallyHidden>);
  expect(screen.getByText("test content")).toBeInTheDocument();
});
