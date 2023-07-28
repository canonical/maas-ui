import { render, screen } from "@testing-library/react";

import Switch from "./Switch";

describe("Switch", () => {
  it("renders", () => {
    render(<Switch />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});
