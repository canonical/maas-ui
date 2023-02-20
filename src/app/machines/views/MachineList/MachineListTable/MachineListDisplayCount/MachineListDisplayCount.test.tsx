import MachineListDisplayCount from "./MachineListDisplayCount";

import { render, screen } from "testing/utils";

describe("MachineListDisplayCount", () => {
  it("shows the true number of machines on a page if it is under the maximum items per page limit.", () => {
    render(
      <MachineListDisplayCount
        currentPage={3}
        machineCount={135}
        pageSize={50}
      />
    );

    expect(
      screen.getByText("Showing 35 out of 135 machines")
    ).toBeInTheDocument();
  });

  it("shows the maximum number of items per page if that limit is reached", () => {
    render(
      <MachineListDisplayCount
        currentPage={2}
        machineCount={135}
        pageSize={50}
      />
    );

    expect(
      screen.getByText("Showing 50 out of 135 machines")
    ).toBeInTheDocument();
  });
});
