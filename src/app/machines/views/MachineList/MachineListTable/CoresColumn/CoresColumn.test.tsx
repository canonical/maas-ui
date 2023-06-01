import { CoresColumn } from "./CoresColumn";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("CoresColumn", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            architecture: "amd64/generic",
            cpu_count: 4,
            cpu_test_status: testStatusFactory({
              status: 1,
            }),
          }),
        ],
      }),
    });
  });

  it("displays the number of cores", () => {
    state.machine.items[0].cpu_count = 8;

    renderWithBrowserRouter(<CoresColumn systemId="abc123" />, {
      route: "/machines",
      state,
    });
    expect(screen.getByLabelText("Cores")).toHaveTextContent("8");
  });

  it("truncates architecture", () => {
    state.machine.items[0].architecture = "i386/generic";

    renderWithBrowserRouter(<CoresColumn systemId="abc123" />, {
      route: "/machines",
      state,
    });
    expect(screen.getByTestId("arch")).toHaveTextContent("i386");
  });

  it("displays a Tooltip with the full architecture", () => {
    state.machine.items[0].architecture = "amd64/generic";

    renderWithBrowserRouter(<CoresColumn systemId="abc123" />, {
      route: "/machines",
      state,
    });

    expect(screen.getByRole("tooltip")).toHaveTextContent("amd64/generic");
  });
});
