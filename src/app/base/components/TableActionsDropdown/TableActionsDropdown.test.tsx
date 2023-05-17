import TableActionsDropdown from "./TableActionsDropdown";

import { render, screen } from "testing/utils";

describe("TableActionsDropdown", () => {
  it("can be explicitly disabled", () => {
    render(
      <TableActionsDropdown
        actions={[
          { label: "Action 1", type: "action-1" },
          { label: "Action 2", type: "action-2" },
          { label: "Action 3", type: "action-3" },
        ]}
        disabled
        onActionClick={jest.fn()}
      />
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled if no actions are provided", () => {
    render(<TableActionsDropdown actions={[]} onActionClick={jest.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("can conditionally show actions", () => {
    render(
      <TableActionsDropdown
        actions={[
          { label: "Action 1", show: true, type: "action-1" },
          { label: "Action 2", type: "action-2" },
          { label: "Action 3", show: false, type: "action-3" },
        ]}
        onActionClick={jest.fn()}
      />
    );
    // Open menu
    const button = screen.getByRole("button");
    button.click();

    expect(
      screen.getByRole("button", { name: "Action 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Action 2" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Action 3" })
    ).not.toBeInTheDocument();
  });

  it("runs click function with action type as argument", () => {
    const onActionClick = jest.fn();
    render(
      <TableActionsDropdown
        actions={[{ label: "Action 1", type: "action-1" }]}
        onActionClick={onActionClick}
      />
    );
    // Open menu and click the actions
    const button = screen.getByRole("button");
    button.click();
    const actionButton = screen.getByRole("button", { name: "Action 1" });
    actionButton.click();

    expect(onActionClick).toHaveBeenCalledWith("action-1");
  });
});
