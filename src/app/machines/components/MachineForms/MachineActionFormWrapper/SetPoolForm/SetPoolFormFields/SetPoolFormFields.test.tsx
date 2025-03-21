import SetPoolForm from "../SetPoolForm";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

describe("SetPoolFormFields", () => {
  let state: RootState;
  const route = "/machines";
  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({ system_id: "abc123" }),
          factory.machine({ system_id: "def456" }),
        ],
        selected: { items: ["abc123", "def456"] },
        statuses: {
          abc123: factory.machineStatus({ settingPool: false }),
          def456: factory.machineStatus({ settingPool: false }),
        },
      }),
    });
  });

  it("shows a select if select pool radio chosen", async () => {
    renderWithBrowserRouter(
      <SetPoolForm
        clearSidePanelContent={vi.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route, state }
    );

    await userEvent.click(screen.getByLabelText("Create pool"));
    expect(
      screen.queryByRole("combobox", { name: "Resource pool" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Select pool"));
    expect(
      screen.getByRole("combobox", { name: "Resource pool" })
    ).toBeInTheDocument();
  });

  it("shows inputs for creating a pool if create pool radio chosen", async () => {
    renderWithBrowserRouter(
      <SetPoolForm
        clearSidePanelContent={vi.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route, state }
    );
    await userEvent.click(screen.getByLabelText("Create pool"));
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });
});
