import { render, screen } from "@testing-library/react";

import MachineListGroupCount from "./MachineListGroupCount";

import { FetchGroupKey } from "app/store/machine/types";
import { useFetchMachineCount } from "app/store/machine/utils/hooks";
import { FetchNodeStatus } from "app/store/types/node";

jest.mock("app/store/machine/utils/hooks");

const mockedUseFetchMachineCount = useFetchMachineCount as jest.MockedFunction<
  typeof useFetchMachineCount
>;

beforeEach(() => {
  mockedUseFetchMachineCount.mockClear();
});

it("renders placeholder when count is null and fetched machines count has not loaded", () => {
  mockedUseFetchMachineCount.mockReturnValue({
    machineCountLoading: true,
    machineCountLoaded: false,
    machineCount: 0,
  });

  render(
    <MachineListGroupCount
      count={null}
      filter={null}
      group={""}
      grouping={null}
    />
  );

  expect(screen.getByText("xx machines")).toBeInTheDocument();
});

it("renders count when count is not null", () => {
  render(
    <MachineListGroupCount count={3} filter={null} group={""} grouping={null} />
  );

  expect(screen.getByText("3 machines")).toBeInTheDocument();
});

it("renders machineCount when count is null and fetched count has loaded", () => {
  mockedUseFetchMachineCount.mockReturnValue({
    machineCountLoading: false,
    machineCountLoaded: true,
    machineCount: 5,
  });

  render(
    <MachineListGroupCount
      count={null}
      filter={null}
      group={""}
      grouping={null}
    />
  );

  expect(screen.getByText("5 machines")).toBeInTheDocument();
});

it("calls useFetchMachineCount with correct parameters", () => {
  mockedUseFetchMachineCount.mockReturnValue({
    machineCountLoading: false,
    machineCountLoaded: false,
    machineCount: 0,
  });

  render(
    <MachineListGroupCount
      count={null}
      filter={{ owner: ["=admin"] }}
      group={FetchNodeStatus.NEW}
      grouping={FetchGroupKey.Status}
    />
  );

  expect(useFetchMachineCount).toHaveBeenCalledWith(
    { owner: ["=admin"], status: ["=new"] },
    { isEnabled: true }
  );
});
