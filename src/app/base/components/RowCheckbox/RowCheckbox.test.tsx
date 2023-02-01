import RowCheckbox from "./RowCheckbox";

import { render, screen } from "testing/utils";

describe("RowCheckbox", () => {
  it("can show a label", () => {
    render(
      <RowCheckbox
        handleRowCheckbox={jest.fn()}
        item={null}
        items={[]}
        label="Check row"
      />
    );
    expect(
      screen.getByRole("checkbox", { name: /Check row/i })
    ).toBeInTheDocument();
  });

  it("can check if it should be selected via a function", () => {
    render(
      <RowCheckbox
        checkSelected={() => true}
        handleRowCheckbox={jest.fn()}
        item={null}
        items={[]}
        label="Check row"
      />
    );
    expect(screen.getByRole("checkbox", { name: /Check row/i })).toBeChecked();
  });
});
