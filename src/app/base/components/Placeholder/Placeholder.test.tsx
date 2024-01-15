import { render, screen } from "@testing-library/react";

import Placeholder from "./Placeholder";

describe("Placeholder", () => {
  beforeEach(() => {
    vi.spyOn(Math, "floor").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders", () => {
    render(<Placeholder>Placeholder text</Placeholder>);
    expect(screen.getByTestId("placeholder")).toBeInTheDocument();
  });

  it("does not return placeholder styling if loading is false", () => {
    render(<Placeholder loading={false}>Placeholder text</Placeholder>);
    expect(screen.queryByTestId("placeholder")).not.toBeInTheDocument();
  });
});
