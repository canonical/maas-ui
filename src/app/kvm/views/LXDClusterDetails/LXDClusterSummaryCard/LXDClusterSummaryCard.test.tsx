import LXDClusterSummaryCard from "./LXDClusterSummaryCard";

import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podResource as podResourceFactory,
  podNetworkInterface as interfaceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, within } from "testing/utils";

describe("LXDClusterSummaryCard", () => {
  it("can show the section for storage", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory({ id: 1 })],
      }),
    });
    renderWithBrowserRouter(
      <LXDClusterSummaryCard clusterId={1} showStorage />,
      { state }
    );

    expect(screen.getByTestId("lxd-cluster-storage")).toBeInTheDocument();
  });

  it("displays a spinner when loading pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loading: true,
      }),
    });
    renderWithBrowserRouter(
      <LXDClusterSummaryCard clusterId={1} showStorage />,
      { state }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can hide the section for storage", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory({ id: 1 })],
      }),
    });
    renderWithBrowserRouter(
      <LXDClusterSummaryCard clusterId={1} showStorage={false} />,
      { state }
    );

    expect(screen.queryByTestId("lxd-cluster-storage")).not.toBeInTheDocument();
  });

  it("aggregates the interfaces in the cluster hosts", () => {
    const interfaces = [
      interfaceFactory({
        virtual_functions: podResourceFactory({
          allocated_other: 2,
          allocated_tracked: 1,
          free: 3,
        }),
      }),
      interfaceFactory({
        virtual_functions: podResourceFactory({
          allocated_other: 2,
          allocated_tracked: 1,
          free: 3,
        }),
      }),
    ];
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            cluster: 1,
            id: 11,
            resources: podResourcesFactory({
              interfaces: [interfaces[0]],
            }),
            type: PodType.LXD,
          }),
          podFactory({
            cluster: 1,
            id: 22,
            resources: podResourcesFactory({
              interfaces: [interfaces[1]],
            }),
            type: PodType.LXD,
          }),
        ],
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            hosts: [vmHostFactory({ id: 11 }), vmHostFactory({ id: 22 })],
          }),
        ],
      }),
    });
    renderWithBrowserRouter(<LXDClusterSummaryCard clusterId={1} />, { state });

    const ifaceMeter = screen.getByTestId("iface-meter");
    expect(ifaceMeter).toBeInTheDocument();
    expect(
      within(ifaceMeter).getByTestId("kvm-resource-allocated")
    ).toHaveTextContent("2");
    expect(
      within(ifaceMeter).getByTestId("kvm-resource-other")
    ).toHaveTextContent("4");
    expect(
      within(ifaceMeter).getByTestId("kvm-resource-free")
    ).toHaveTextContent("6");
    expect(within(ifaceMeter).getByTestId("meter-label")).toHaveTextContent(
      "2"
    );
  });
});
