import { DisksColumn } from "./DisksColumn";

import type { RootState } from "app/store/root/types";
import { TestStatusStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

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

  it("displays the physical disk count", () => {
    state.machine.items[0].physical_disk_count = 2;

    renderWithBrowserRouter(<DisksColumn systemId="abc123" />, {
      route: "/machines",
      state,
    });
    expect(screen.getByTestId("primary")).toHaveTextContent("2");
  });

  it("correctly shows error icon and tooltip if storage tests failed", () => {
    state.machine.items[0].storage_test_status = testStatusFactory({
      status: TestStatusStatus.FAILED,
    });

    const { container } = renderWithBrowserRouter(
      <DisksColumn systemId="abc123" />,
      {
        route: "/machines",
        state,
      }
    );

    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector(".p-icon--error")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Machine has failed tests."
    );
  });
});
