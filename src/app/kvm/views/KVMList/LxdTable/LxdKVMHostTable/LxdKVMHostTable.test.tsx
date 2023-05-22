import { render } from "@testing-library/react";

import LxdKVMHostTable from "./LxdKVMHostTable";
import { generateClusterRows, generateSingleHostRows } from "./LxdTable";

import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVmCount as podVmCountFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmHost as vmHostFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("LxdKVMHostTable", () => {
  it("can update the LXD hosts sort order", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            name: "lxd-2",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 3 }),
            }),
            type: PodType.LXD,
          }),
          podFactory({
            name: "lxd-3",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 1 }),
            }),
            type: PodType.LXD,
          }),
          podFactory({
            name: "lxd-1",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 2 }),
            }),
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />,
      { route: "/kvm", store }
    );
    const getLxdVms = (rowNumber: number) =>
      screen
        .getAllByRole("cell")
        .filter((cell) => cell.dataset.testid === "machines-count")[rowNumber];

    // Sorted ascending by name by default
    expect(getLxdVms(0).textContent).toBe("2");
    expect(getLxdVms(1).textContent).toBe("3");
    expect(getLxdVms(2).textContent).toBe("1");

    // Change to sort ascending vms
    screen.getByTestId("vms-header").click();
    expect(getLxdVms(0).textContent).toBe("1");
    expect(getLxdVms(1).textContent).toBe("2");
    expect(getLxdVms(2).textContent).toBe("3");

    // Change to descending vms
    screen.getByTestId("vms-header").click();
    expect(getLxdVms(0).textContent).toBe("3");
    expect(getLxdVms(1).textContent).toBe("2");
    expect(getLxdVms(2).textContent).toBe("1");

    // Change to no sort
    screen.getByTestId("vms-header").click();
    expect(getLxdVms(0).textContent).toBe("3");
    expect(getLxdVms(1).textContent).toBe("1");
    expect(getLxdVms(2).textContent).toBe("2");
  });

  it("can update the LXD project sort order", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            name: "pod-2",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-1",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-3",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-4",
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />,
      { route: "/kvm", store }
    );
    const getLxdName = (rowNumber: number) =>
      screen
        .getAllByRole("cell")
        .filter((cell) => cell.dataset.testid === "name")[rowNumber];

    // Sorted ascending by name by default
    expect(getLxdName(0).textContent).toBe("pod-1");
    expect(getLxdName(1).textContent).toBe("pod-2");
    expect(getLxdName(2).textContent).toBe("pod-3");
    expect(getLxdName(3).textContent).toBe("pod-4");

    // Change to sort descending by name. Groups themselves are not sorted so
    // only the LXD pods in each group should be sorted.
    screen.getByTestId("name-header").click();
    expect(getLxdName(0).textContent).toBe("pod-4");
    expect(getLxdName(1).textContent).toBe("pod-3");
    expect(getLxdName(2).textContent).toBe("pod-2");
    expect(getLxdName(3).textContent).toBe("pod-1");

    // Change to no sort
    screen.getByTestId("name-header").click();
    expect(getLxdName(0).textContent).toBe("pod-2");
    expect(getLxdName(1).textContent).toBe("pod-1");
    expect(getLxdName(2).textContent).toBe("pod-3");
    expect(getLxdName(3).textContent).toBe("pod-4");
  });

  it("can display a single host type", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory()],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />,
      { route: "/kvm", store }
    );
    expect(screen.getByTestId("host-type")).toHaveTextContent("Single host");
    expect(screen.queryByTestId("hosts-count")).toBeNull();
  });

  it("can display a cluster host type", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            hosts: [vmHostFactory(), vmHostFactory()],
          }),
        ],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LxdKVMHostTable rows={generateClusterRows(state.vmcluster.items)} />,
      { route: "/kvm", store }
    );
    expect(screen.getByTestId("host-type")).toHaveTextContent("Cluster");
    expect(screen.getByTestId("hosts-count")).toHaveTextContent("2 KVM hosts");
  });
});
