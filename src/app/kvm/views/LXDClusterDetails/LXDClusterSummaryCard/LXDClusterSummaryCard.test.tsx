import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDClusterSummaryCard from "./LXDClusterSummaryCard";

import VfResources from "app/kvm/components/VfResources";
import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podNetworkInterface as interfaceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <LXDClusterSummaryCard clusterId={1} showStorage />
      </Provider>,
      {}
    );

    expect(screen.getByTestId("lxd-cluster-storage")).toBeInTheDocument();
  });

  it("displays a spinner when loading pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loading: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <LXDClusterSummaryCard clusterId={1} showStorage />
      </Provider>,
      {}
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <LXDClusterSummaryCard clusterId={1} showStorage={false} />
      </Provider>,
      {}
    );

    expect(screen.queryByTestId("lxd-cluster-storage")).not.toBeInTheDocument();
  });

  it("aggregates the interfaces in the cluster hosts", () => {
    const interfaces = [interfaceFactory(), interfaceFactory()];
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <LXDClusterSummaryCard clusterId={1} />
      </Provider>,
      {}
    );

    expect(screen.getByRole("icon")).toBeInTheDocument();
    expect(screen.getByRole("icon")).toContainElement(
      document.createElement("i")
    );
    expect(screen.getByRole("interface")).toHaveValue(interfaces);
  });
});
