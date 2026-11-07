import MachineListSelectedCount from "./MachineListSelectedCount";

import { machineActions } from "@/app/store/machine";
import { screen, renderWithProviders, userEvent } from "@/testing/utils";

describe("MachineListSelectedCount", () => {
  it("displays the number of selected machines out of the total", () => {
    renderWithProviders(
      <MachineListSelectedCount
        filter={""}
        machineCount={20}
        selectedCount={10}
      />
    );

    expect(screen.getByText(/10 of 20 machines selected/i)).toBeInTheDocument();
  });

  it("dispatches an action to select all machines matching the filter", async () => {
    const { store } = renderWithProviders(
      <MachineListSelectedCount
        filter={"this-is-a-filter"}
        machineCount={20}
        selectedCount={10}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Select all" }));

    const expectedAction = machineActions.setSelected({
      filter: { free_text: ["this-is-a-filter"] },
    });

    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("displays a message when all machines are selected", () => {
    renderWithProviders(
      <MachineListSelectedCount
        filter={""}
        machineCount={20}
        selectedCount={20}
      />
    );

    expect(screen.getByText("All 20 machines selected")).toBeInTheDocument();
  });
});
