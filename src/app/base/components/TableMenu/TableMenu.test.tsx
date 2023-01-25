import TableMenu from "./TableMenu";

import { userEvent, render, screen } from "testing/utils";

describe("TableMenu ", () => {
  it("expands the menu on click", async () => {
    render(<TableMenu links={[{ children: "Item1" }]} title="Actions:" />);
    const actionsButton = screen.getByRole("button", { name: "Actions:" });
    expect(actionsButton).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Item1" })
    ).not.toBeInTheDocument();
    await userEvent.click(actionsButton);
    expect(actionsButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Item1" })).toBeInTheDocument();
  });
});
