import SetPoolForm from "../SetPoolForm";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("SetPoolFormFields", () => {
  let state: RootState;
  const route = "/machines";
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        selected: ["abc123", "def456"],
        statuses: {
          abc123: machineStatusFactory({ settingPool: false }),
          def456: machineStatusFactory({ settingPool: false }),
        },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({ id: 0, name: "default" }),
          resourcePoolFactory({ id: 1, name: "pool-1" }),
        ],
      }),
    });
  });

  it("shows a select if select pool radio chosen", async () => {
    renderWithBrowserRouter(
      <SetPoolForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route, state }
    );
    await userEvent.click(screen.getByLabelText("Select pool"));
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows inputs for creating a pool if create pool radio chosen", async () => {
    renderWithBrowserRouter(
      <SetPoolForm
        clearSidePanelContent={jest.fn()}
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
