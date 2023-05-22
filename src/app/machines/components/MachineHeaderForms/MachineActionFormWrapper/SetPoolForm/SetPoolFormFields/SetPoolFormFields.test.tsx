import configureStore from "redux-mock-store";

import SetPoolForm from "../SetPoolForm";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("SetPoolFormFields", () => {
  let state: RootState;
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
    const store = mockStore(state);
    const route = "/machines";
    renderWithBrowserRouter(
      <SetPoolForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route, store }
    );
    userEvent.click(screen.getByLabelText("Select pool"));
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows inputs for creating a pool if create pool radio chosen", async () => {
    const store = mockStore(state);
    const route = "/machines";
    renderWithBrowserRouter(
      <SetPoolForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route, store }
    );
    userEvent.click(screen.getByLabelText("Create new pool"));
    expect(screen.getByLabelText("Pool Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });
});
