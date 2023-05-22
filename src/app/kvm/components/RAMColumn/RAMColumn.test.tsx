import configureStore from "redux-mock-store";

import RAMColumn from "./RAMColumn";

import {
  pod as podFactory,
  podMemoryResource as podMemoryResourceFactory,
  podResource as podResourceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmClusterResource as vmClusterResourceFactory,
  vmClusterResourcesMemory as vmClusterResourcesMemoryFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("RAMColumn", () => {
  let state: RootState;
  let pod: Pod;

  beforeEach(() => {
    pod = podFactory({
      id: 1,
      name: "pod-1",
    });
    state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
  });

  it("can display correct memory information without overcommit", () => {
    pod.memory_over_commit_ratio = 1;
    pod.resources = podResourcesFactory({
      memory: podMemoryResourceFactory({
        general: podResourceFactory({
          allocated_other: 1,
          allocated_tracked: 2,
          free: 3,
        }),
        hugepages: podResourceFactory({
          allocated_other: 4,
          allocated_tracked: 5,
          free: 6,
        }),
      }),
    });
    const store = mockStore(state);
    const { container } = render(
      <RAMColumn
        memory={pod.resources.memory}
        overCommit={pod.memory_over_commit_ratio}
      />,
      { store }
    );
    // Allocated tracked = 2 + 5 = 7
    // Total = (1 + 2 + 3) + (4 + 5 + 6) = 6 + 15 = 21
    expect(
      screen.getByText(/7 of 21B allocated/i, { container })
    ).toBeInTheDocument();
    expect(screen.getByRole("meter", { container })).toHaveAttribute(
      "max",
      "21"
    );
  });

  it("can display correct memory information with overcommit", () => {
    pod.memory_over_commit_ratio = 2;
    pod.resources = podResourcesFactory({
      memory: podMemoryResourceFactory({
        general: podResourceFactory({
          allocated_other: 1,
          allocated_tracked: 2,
          free: 3,
        }),
        hugepages: podResourceFactory({
          allocated_other: 4,
          allocated_tracked: 5,
          free: 6,
        }),
      }),
    });
    const store = mockStore(state);
    const { container } = render(
      <RAMColumn
        memory={pod.resources.memory}
        overCommit={pod.memory_over_commit_ratio}
      />,
      { store }
    );
    // Allocated tracked = 2 + 5 = 7
    // Hugepages do not take overcommit into account, so
    // Total = ((1 + 2 + 3) * 2) + (4 + 5 + 6) = 12 + 15 = 27
    expect(
      screen.getByText(/7 of 27B allocated/i, { container })
    ).toBeInTheDocument();
    expect(screen.getByRole("meter", { container })).toHaveAttribute(
      "max",
      "27"
    );
  });

  it("can display when memory has been overcommitted", () => {
    pod.memory_over_commit_ratio = 1;
    pod.resources = podResourcesFactory({
      memory: podMemoryResourceFactory({
        general: podResourceFactory({
          allocated_other: 0,
          allocated_tracked: 2,
          free: -1,
        }),
        hugepages: podResourceFactory({
          allocated_other: 0,
          allocated_tracked: 5,
          free: -1,
        }),
      }),
    });
    const store = mockStore(state);
    const { container } = render(
      <RAMColumn
        memory={pod.resources.memory}
        overCommit={pod.memory_over_commit_ratio}
      />,
      { store }
    );
    expect(
      screen.getByTestId("meter-overflow", { container })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/7 of 5B allocated/i, { container })
    ).toBeInTheDocument();
    expect(screen.getByRole("meter", { container })).toHaveAttribute(
      "max",
      "5"
    );
  });

  it("can display correct memory for a vmcluster", () => {
    const memory = vmClusterResourcesMemoryFactory({
      general: vmClusterResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      }),
      hugepages: vmClusterResourceFactory({
        allocated_other: 4,
        allocated_tracked: 5,
        free: 6,
      }),
    });
    const store = mockStore(state);
    const { container } = render(<RAMColumn memory={memory} />, { store });
    expect(
      screen.getByText(/7 of 21B allocated/i, { container })
    ).toBeInTheDocument();
    expect(screen.getByRole("meter", { container })).toHaveAttribute(
      "max",
      "21"
    );
  });
});
