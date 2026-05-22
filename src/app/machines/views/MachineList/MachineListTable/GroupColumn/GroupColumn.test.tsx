import type { MockedFunction } from "vitest";

import GroupColumn from "./GroupColumn";

import { FetchGroupKey } from "@/app/store/machine/types";
import { useFetchMachineCount } from "@/app/store/machine/utils/hooks";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, waitFor } from "@/testing/utils";

vi.mock("@/app/store/machine/utils/hooks");

const mockedUseFetchMachineCount = useFetchMachineCount as MockedFunction<
  typeof useFetchMachineCount
>;
mockedUseFetchMachineCount.mockReturnValue({
  machineCountLoading: false,
  machineCountLoaded: true,
  machineCount: 2,
});

it("toggle button has aria-expanded=false when group is collapsed", () => {
  const group = factory.machineStateListGroup({
    collapsed: true,
    count: 3,
    name: "Deployed",
    value: "deployed",
  });
  renderWithProviders(
    <GroupColumn
      callId="test-call-id"
      filter={null}
      group={group}
      grouping={FetchGroupKey.Status}
      hiddenGroups={["deployed"]}
      setHiddenGroups={vi.fn()}
      showActions={false}
    />
  );
  const toggle = screen.getByRole("button", {
    name: "Show Deployed machines group",
  });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
});

it("toggle button has aria-expanded=true when group is expanded", () => {
  const group = factory.machineStateListGroup({
    collapsed: false,
    count: 3,
    name: "Ready",
    value: "ready",
  });
  renderWithProviders(
    <GroupColumn
      callId="test-call-id"
      filter={null}
      group={group}
      grouping={FetchGroupKey.Status}
      hiddenGroups={[]}
      setHiddenGroups={vi.fn()}
      showActions={false}
    />
  );
  const toggle = screen.getByRole("button", {
    name: "Hide Ready machines group",
  });
  expect(toggle).toHaveAttribute("aria-expanded", "true");
});

it("displays the correct column name and machines count", () => {
  const group = factory.machineStateListGroup({
    collapsed: false,
    count: 5,
    name: "Test Group",
    value: "test-group",
  });
  renderWithProviders(
    <GroupColumn
      callId="test-call-id"
      filter={null}
      group={group}
      grouping={FetchGroupKey.Status}
      hiddenGroups={[null]}
      setHiddenGroups={vi.fn()}
      showActions={false}
    />
  );

  expect(screen.getByText(/Test Group/)).toBeInTheDocument();
  expect(screen.getByText(/5 machines/)).toBeInTheDocument();
});

it("displays correct fetched machines count when initial count is null", async () => {
  const group = factory.machineStateListGroup({
    collapsed: false,
    count: null,
    name: "Test Group",
    value: "test-group",
  });

  renderWithProviders(
    <GroupColumn
      callId="test-call-id"
      filter={null}
      group={group}
      grouping={FetchGroupKey.Status}
      hiddenGroups={[null]}
      setHiddenGroups={vi.fn()}
      showActions={false}
    />
  );

  expect(screen.getByText(/Test Group/)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText(/2 machines/)).toBeInTheDocument();
  });
});
