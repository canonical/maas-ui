import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import GroupSelect from "./GroupSelect";

it("executes setGrouping and setHiddenGroups functions on change", async () => {
  const setGrouping = jest.fn();
  const setHiddenGroups = jest.fn();
  render(
    <GroupSelect
      grouping={null}
      setGrouping={setGrouping}
      setHiddenGroups={setHiddenGroups}
    />
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Group by" }),
    "status"
  );
  expect(setGrouping).toHaveBeenCalledWith("status");
  expect(setHiddenGroups).toHaveBeenCalledWith([]);
});
