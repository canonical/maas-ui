import WorkloadCard from "./WorkloadCard";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("WorkloadCard", () => {
  it("displays a message if the machine has no workload annotations", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            workload_annotations: {},
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<WorkloadCard id="abc123" />, {
      route: "/machine/abc123",
      store,
    });
    expect(screen.getByTestId("no-workload-annotations")).toBeInTheDocument();
  });

  it("can display a list of workload annotations", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            workload_annotations: {
              key1: "value1",
              key2: "value2",
            },
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<WorkloadCard id="abc123" />, {
      route: "/machine/abc123",
      store,
    });

    expect(screen.getAllByTestId("workload-annotations-item")).toHaveLength(2);
    expect(screen.getByTestId("workload-key").textContent).toBe("key1");
    expect(screen.getByTestId("workload-value").textContent).toBe("value1");
  });

  it("displays comma-separated values on new lines", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            workload_annotations: {
              separated: "comma,separated,value",
            },
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<WorkloadCard id="abc123" />, {
      route: "/machine/abc123",
      store,
    });

    expect(screen.getByText(/comma/)).toBeInTheDocument();
    expect(screen.getByText(/separated/)).toBeInTheDocument();
    expect(screen.getByText(/value/)).toBeInTheDocument();
  });

  it("displays links to filter machine list by workload annotation", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            workload_annotations: {
              key: "value",
            },
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<WorkloadCard id="abc123" />, {
      route: "/machine/abc123",
      store,
    });

    expect(screen.getByText(/value/)).toHaveAttribute(
      "href",
      "/machines?workload-key=value"
    );
  });
});
