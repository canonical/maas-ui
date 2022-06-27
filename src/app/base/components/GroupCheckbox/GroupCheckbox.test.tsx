import { render, screen } from "@testing-library/react";

import GroupCheckbox from "./GroupCheckbox";

describe("GroupCheckbox", () => {
  it("shows as mixed when some items are checked", () => {
    render(
      <GroupCheckbox
        handleGroupCheckbox={jest.fn()}
        items={[1, 2, 3]}
        selectedItems={[2]}
      />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
  });

  it("can show a label", () => {
    render(
      <GroupCheckbox
        handleGroupCheckbox={jest.fn()}
        inputLabel="Check all"
        items={[]}
        selectedItems={[]}
      />
    );

    expect(
      screen.getByRole("checkbox", { name: "Check all" })
    ).toBeInTheDocument();
  });

  it("can be disabled even if items exist", () => {
    render(
      <GroupCheckbox
        disabled
        handleGroupCheckbox={jest.fn()}
        inputLabel="Check all"
        items={[1, 2, 3]}
        selectedItems={[2]}
      />
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("can check if it should be selected via a function", () => {
    render(
      <GroupCheckbox
        checkSelected={() => true}
        handleGroupCheckbox={jest.fn()}
        items={[]}
        selectedItems={[]}
      />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("can check if it should display as mixed via a function", () => {
    render(
      <GroupCheckbox
        checkAllSelected={() => false}
        handleGroupCheckbox={jest.fn()}
        items={[1, 2, 3]}
        selectedItems={[2]}
      />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
  });
});
