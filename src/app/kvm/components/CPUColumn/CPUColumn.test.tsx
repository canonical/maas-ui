import CPUColumn from "./CPUColumn";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podResource as podResourceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmClusterResource as vmClusterResourceFactory,
} from "testing/factories";
import { renderWithMockStore, screen } from "testing/utils";

describe("CPUColumn", () => {
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

  it("can display correct cpu core information without overcommit", () => {
    pod.cpu_over_commit_ratio = 1;
    pod.resources = podResourcesFactory({
      cores: podResourceFactory({
        allocated_other: 0,
        allocated_tracked: 4,
        free: 4,
      }),
    });

    renderWithMockStore(
      <CPUColumn
        cores={pod.resources.cores}
        overCommit={pod.cpu_over_commit_ratio}
      />,
      { state }
    );
    expect(screen.getByText(/4 of 8/i)).toBeInTheDocument();
  });

  it("can display correct cpu core information with overcommit", () => {
    pod.cpu_over_commit_ratio = 2;
    pod.resources = podResourcesFactory({
      cores: podResourceFactory({
        allocated_other: 0,
        allocated_tracked: 4,
        free: 4,
      }),
    });

    renderWithMockStore(
      <CPUColumn
        cores={pod.resources.cores}
        overCommit={pod.cpu_over_commit_ratio}
      />,
      { state }
    );
    expect(screen.getByText(/4 of 16/i)).toBeInTheDocument();
  });

  it("can display when cpu has been overcommitted", () => {
    pod.cpu_over_commit_ratio = 1;
    pod.resources = podResourcesFactory({
      cores: podResourceFactory({
        allocated_other: 0,
        allocated_tracked: 4,
        free: -1,
      }),
    });

    renderWithMockStore(
      <CPUColumn
        cores={pod.resources.cores}
        overCommit={pod.cpu_over_commit_ratio}
      />,
      { state }
    );
    expect(screen.getByTestId("meter-overflow")).toBeInTheDocument();
    expect(screen.getByText(/4 of 3/i)).toBeInTheDocument();
  });

  it("can display correct cpu core information for vmclusters", () => {
    const resources = vmClusterResourceFactory({
      allocated_other: 1,
      allocated_tracked: 2,
      free: 3,
    });

    renderWithMockStore(<CPUColumn cores={resources} />, {
      state,
    });
    expect(screen.getByText(/2 of 6/i)).toBeInTheDocument();
  });
});
