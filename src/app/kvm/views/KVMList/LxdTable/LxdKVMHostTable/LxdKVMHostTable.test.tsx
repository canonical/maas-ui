import { generateClusterRows, generateSingleHostRows } from "../LxdTable";

import LxdKVMHostTable from "./LxdKVMHostTable";

import { PodType } from "@/app/store/pod/constants";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

describe("LxdKVMHostTable", () => {
  it("can update the LXD hosts sort order", async () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [
          factory.pod({
            name: "lxd-2",
            resources: factory.podResources({
              vm_count: factory.podVmCount({ tracked: 3 }),
            }),
            type: PodType.LXD,
          }),
          factory.pod({
            name: "lxd-3",
            resources: factory.podResources({
              vm_count: factory.podVmCount({ tracked: 1 }),
            }),
            type: PodType.LXD,
          }),
          factory.pod({
            name: "lxd-1",
            resources: factory.podResources({
              vm_count: factory.podVmCount({ tracked: 2 }),
            }),
            type: PodType.LXD,
          }),
        ],
      }),
    });
    renderWithProviders(
      <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />,
      { state }
    );
    const getLxdVms = (rowNumber: number) =>
      screen.getAllByTestId("machines-count")[rowNumber];

    // Sorted ascending by name by default
    expect(getLxdVms(0).textContent).toBe("2");
    expect(getLxdVms(1).textContent).toBe("3");
    expect(getLxdVms(2).textContent).toBe("1");

    // Change to sort ascending vms
    await userEvent.click(screen.getByRole("button", { name: /VM s/i }));
    expect(getLxdVms(0).textContent).toBe("1");
    expect(getLxdVms(1).textContent).toBe("2");
    expect(getLxdVms(2).textContent).toBe("3");

    // Change to descending vms
    await userEvent.click(screen.getByRole("button", { name: /VM s/i }));
    expect(getLxdVms(0).textContent).toBe("3");
    expect(getLxdVms(1).textContent).toBe("2");
    expect(getLxdVms(2).textContent).toBe("1");

    // Change to no sort
    await userEvent.click(screen.getByRole("button", { name: /VM s/i }));
    expect(getLxdVms(0).textContent).toBe("3");
    expect(getLxdVms(1).textContent).toBe("1");
    expect(getLxdVms(2).textContent).toBe("2");
  });

  it("can update the LXD project sort order", async () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [
          factory.pod({
            name: "pod-2",
            type: PodType.LXD,
          }),
          factory.pod({
            name: "pod-1",
            type: PodType.LXD,
          }),
          factory.pod({
            name: "pod-3",
            type: PodType.LXD,
          }),
          factory.pod({
            name: "pod-4",
            type: PodType.LXD,
          }),
        ],
      }),
    });
    renderWithProviders(
      <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />,
      { state }
    );
    const getLxdName = (rowNumber: number) =>
      screen.getAllByTestId("name")[rowNumber];

    // Sorted ascending by name by default
    expect(getLxdName(0).textContent).toBe("pod-1");
    expect(getLxdName(1).textContent).toBe("pod-2");
    expect(getLxdName(2).textContent).toBe("pod-3");
    expect(getLxdName(3).textContent).toBe("pod-4");

    // Change to sort descending by name. Groups themselves are not sorted so
    // only the LXD pods in each group should be sorted.
    await userEvent.click(screen.getByRole("button", { name: /Name/i }));
    expect(getLxdName(0).textContent).toBe("pod-4");
    expect(getLxdName(1).textContent).toBe("pod-3");
    expect(getLxdName(2).textContent).toBe("pod-2");
    expect(getLxdName(3).textContent).toBe("pod-1");

    // Change to no sort
    await userEvent.click(screen.getByRole("button", { name: /Name/i }));
    expect(getLxdName(0).textContent).toBe("pod-2");
    expect(getLxdName(1).textContent).toBe("pod-1");
    expect(getLxdName(2).textContent).toBe("pod-3");
    expect(getLxdName(3).textContent).toBe("pod-4");
  });

  it("can display a single host type", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [factory.pod()],
      }),
    });
    renderWithProviders(
      <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />,
      { state }
    );
    expect(screen.getByTestId("host-type")).toHaveTextContent("Single host");
    expect(screen.queryByTestId("hosts-count")).toBeNull();
  });

  it("can display a cluster host type", () => {
    const state = factory.rootState({
      vmcluster: factory.vmClusterState({
        items: [
          factory.vmCluster({
            hosts: [factory.vmHost(), factory.vmHost()],
          }),
        ],
      }),
    });
    renderWithProviders(
      <LxdKVMHostTable rows={generateClusterRows(state.vmcluster.items)} />,
      { state }
    );
    expect(screen.getByTestId("host-type")).toHaveTextContent("Cluster");
    expect(screen.getByTestId("hosts-count")).toHaveTextContent("2 KVM hosts");
  });

  it("displays a message when empty", () => {
    renderWithProviders(<LxdKVMHostTable rows={[]} />, {});

    expect(screen.getByText("No hosts available.")).toBeInTheDocument();
  });
});
