import configureStore from "redux-mock-store";

import { DisksColumn } from "./DisksColumn";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("DisksColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            physical_disk_count: 1,
            storage_test_status: testStatusFactory({
              status: 2,
            }),
          }),
        ],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<DisksColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });
    expect(screen.getByTestId("disks-column")).toMatchSnapshot();
  });

  it("displays the physical disk count", () => {
    state.machine.items[0].physical_disk_count = 2;
    const store = mockStore(state);
    renderWithBrowserRouter(<DisksColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });
    expect(screen.getByTestId("disks")).toHaveTextContent("2");
  });

  it("correctly shows error icon and tooltip if storage tests failed", () => {
    state.machine.items[0].storage_test_status = testStatusFactory({
      status: "FAILED",
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<DisksColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });
    expect(screen.getByLabelText(/Storage tests failed/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Storage tests failed/)).toHaveClass(
      "p-icon--error"
    );
    expect(screen.getByLabelText(/Storage tests failed/)).toHaveAttribute(
      "data-tooltip-position",
      "left"
    );
    expect(screen.getByLabelText(/Storage tests failed/)).toHaveAttribute(
      "data-tooltip",
      "Storage tests failed"
    );
  });
});
