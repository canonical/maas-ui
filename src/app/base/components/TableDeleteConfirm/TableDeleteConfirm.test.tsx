import { render, screen } from "@testing-library/react";

import TableDeleteConfirm from "./TableDeleteConfirm";

describe("TableDeleteConfirm", () => {
  it("renders", () => {
    render(
      <TableDeleteConfirm
        deleted={false}
        deleting={false}
        modelName="Cobba"
        modelType="user"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();
  });
});
