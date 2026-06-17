import MachineSelectTable from "./MachineSelectTable";

import type { Machine } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

describe("MachineSelectTable", () => {
  let machines: Machine[];
  let state: RootState;

  beforeEach(() => {
    machines = [
      factory.machine({
        system_id: "abc123",
        hostname: "first",
        owner: "admin",
        tags: [12],
      }),
      factory.machine({
        system_id: "def456",
        hostname: "second",
        owner: "user",
        tags: [13],
      }),
    ];
    state = factory.rootState({
      machine: factory.machineState({
        items: machines,
      }),
      tag: factory.tagState({
        items: [
          factory.tag({ id: 12, name: "tagA" }),
          factory.tag({ id: 13, name: "tagB" }),
        ],
      }),
    });
  });

  it("shows a loading skeleton while data is loading", () => {
    state.machine.loading = true;
    renderWithProviders(
      <MachineSelectTable
        machines={machines}
        machinesLoading={true}
        onMachineClick={vi.fn()}
        searchText=""
        setSearchText={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("highlights the substring that matches the search text", async () => {
    renderWithProviders(
      <MachineSelectTable
        machines={[machines[0]]}
        onMachineClick={vi.fn()}
        searchText="fir"
        setSearchText={vi.fn()}
      />,
      { state }
    );

    expect(screen.getByText("fir")).toBeInTheDocument();
  });

  it("runs onMachineClick function on row click", async () => {
    const onMachineClick = vi.fn();

    renderWithProviders(
      <MachineSelectTable
        machines={machines}
        onMachineClick={onMachineClick}
        searchText=""
        setSearchText={vi.fn()}
      />,
      { state }
    );

    // have to click through to the span that has the click handler
    await userEvent.click(
      screen.getByRole("cell", { name: new RegExp(machines[0].hostname) })
        .firstChild as Element
    );
    expect(onMachineClick).toHaveBeenCalledWith(machines[0]);
  });

  it("displays tag names", () => {
    renderWithProviders(
      <MachineSelectTable
        machines={machines}
        onMachineClick={vi.fn()}
        searchText=""
        setSearchText={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByText("tagA")).toBeInTheDocument();
  });

  it("renders with partial search string", async () => {
    const onMachineClick = vi.fn();
    renderWithProviders(
      <MachineSelectTable
        machines={machines}
        onMachineClick={onMachineClick}
        searchText="id:("
        setSearchText={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
