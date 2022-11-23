import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TableMenu from "./TableMenu";

describe("TableMenu ", () => {
  it("expands the menu on click", () => {
    render(<TableMenu links={[{ children: "Item1" }]} title="Actions:" />);
    const actionsButton = screen.getByRole("button", { name: "Actions:" });
    expect(actionsButton).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Item1" })
    ).not.toBeInTheDocument();
    userEvent.click(actionsButton);
    expect(actionsButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Item1" })).toBeInTheDocument();
  });
});