import { render } from "@testing-library/react";

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
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CPUColumn
        cores={pod.resources.cores}
        overCommit={pod.cpu_over_commit_ratio}
      />,
      { route: "/machines", store }
    );
    expect(screen.getByText(/4 of 8/i)).toBeInTheDocument();
    expect(screen.getByRole("meter")).toHaveAttribute("max", "8");
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CPUColumn
        cores={pod.resources.cores}
        overCommit={pod.cpu_over_commit_ratio}
      />,
      { route: "/machines", store }
    );
    expect(screen.getByText(/4 of 16/i)).toBeInTheDocument();
    expect(screen.getByRole("meter")).toHaveAttribute("max", "16");
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CPUColumn
        cores={pod.resources.cores}
        overCommit={pod.cpu_over_commit_ratio}
      />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("meter-overflow")).toBeInTheDocument();
    expect(screen.getByText(/4 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole("meter")).toHaveAttribute("max", "3");
  });

  it("can display correct cpu core information for vmclusters", () => {
    const resources = vmClusterResourceFactory({
      allocated_other: 1,
      allocated_tracked: 2,
      free: 3,
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<CPUColumn cores={resources} />, {
      route: "/machines",
      store,
    });
    expect(screen.getByText(/2 of 6/i)).toBeInTheDocument();
    expect(screen.getByRole("meter")).toHaveAttribute("max", "6");
  });
});
