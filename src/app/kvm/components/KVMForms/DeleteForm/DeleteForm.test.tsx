import configureStore from "redux-mock-store";

import DeleteForm from "./DeleteForm";

import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterEventError as vmClusterEventErrorFactory,
  vmClusterState as vmClusterStateFactory,
  vmClusterStatuses as vmClusterStatusesFactory,
} from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DeleteForm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can show the processing status when deleting the given pod", () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: true }),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeleteForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm", store }
    );

    expect(screen.getByTestId("saving-label")).toHaveTextContent(
      "Removing KVM host..."
    );
  });

  it("can show the processing status when deleting the given cluster", async () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: true,
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeleteForm clearSidePanelContent={jest.fn()} clusterId={1} />,
      { route: "/kvm", store }
    );
    expect(screen.getByTestId("saving-label")).toHaveTextContent(
      "Removing cluster..."
    );
  });

  it("shows a decompose checkbox if deleting a LXD pod", async () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeleteForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm", store }
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Selecting this option will delete all VMs in pod2 along with their storage.",
      })
    ).toBeInTheDocument();
  });

  it("shows a decompose checkbox if deleting a cluster", async () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: false,
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeleteForm clearSidePanelContent={jest.fn()} clusterId={1} />,
      { route: "/kvm", store }
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Selecting this option will delete all VMs in clusterA along with their storage.",
      })
    ).toBeInTheDocument();
  });

  it("does not show a decompose checkbox if deleting a non-LXD pod", async () => {
    const pod = podFactory({ id: 1, type: PodType.VIRSH });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeleteForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm", store }
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("correctly dispatches actions to delete given KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeleteForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm", store }
    );

    expect(
      screen.getByRole("button", { name: /Remove KVM Host/i })
    ).toBeEnabled();
    await userEvent.click(
      screen.getByRole("button", { name: /Remove KVM Host/i })
    );

    expect(
      store.getActions().find((action) => action.type === "pod/delete")
    ).toStrictEqual({
      type: "pod/delete",
      meta: {
        model: "pod",
        method: "delete",
      },
      payload: {
        params: {
          decompose: false,
          id: pod.id,
        },
      },
    });
  });

  it("correctly dispatches actions to delete a cluster", async () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: false,
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeleteForm clearSidePanelContent={jest.fn()} clusterId={1} />,
      { route: "/kvm", store }
    );

    expect(
      screen.getByRole("button", { name: /Remove cluster/i })
    ).toBeEnabled();
    await userEvent.click(
      screen.getByRole("button", { name: /Remove cluster/i })
    );
    expect(
      store.getActions().find((action) => action.type === "vmcluster/delete")
    ).toStrictEqual({
      type: "vmcluster/delete",
      meta: {
        model: "vmcluster",
        method: "delete",
      },
      payload: {
        params: {
          decompose: false,
          id: cluster.id,
        },
      },
    });
  });

  it("sets the form to saved when a cluster has been deleted", () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: true,
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = () => (
      <DeleteForm clearSidePanelContent={jest.fn()} clusterId={1} />
    );
    const { rerender } = renderWithBrowserRouter(<Proxy />, {
      route: "/kvm",
      store,
    });

    // Cluster is being deleted - form shouldn't be saved yet.
    expect(screen.getByTestId("saving-label")).toHaveTextContent(
      "Removing cluster..."
    );

    // Mock the change from deleting the cluster to no longer deleting the
    // cluster, then rerender the component.
    jest.spyOn(vmClusterSelectors, "status").mockReturnValue(false);
    rerender(<DeleteForm clearSidePanelContent={jest.fn()} clusterId={1} />);

    // Form should have saved successfully.
    expect(screen.queryByTestId("saving-label")).not.toBeInTheDocument();
  });

  it("sets the form to saved when a pod has been deleted", () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: true }),
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = () => (
      <DeleteForm clearSidePanelContent={jest.fn()} hostId={1} />
    );
    const { rerender } = renderWithBrowserRouter(<Proxy />, {
      route: "/kvm",
      store,
    });

    // Pod is being deleted - form shouldn't be saved yet.
    expect(screen.getByTestId("saving-label")).toHaveTextContent(
      "Removing KVM host..."
    );

    // Mock the change from deleting the pod to no longer deleting the pod, then
    // rerender the component.
    jest.spyOn(podSelectors, "deleting").mockReturnValue([]);
    rerender(<DeleteForm clearSidePanelContent={jest.fn()} hostId={1} />);

    // Form should have saved successfully.
    expect(screen.queryByTestId("saving-label")).not.toBeInTheDocument();
  });

  it("clusters do not get marked as deleted if there is an error", () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: true,
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = () => (
      <DeleteForm clearSidePanelContent={jest.fn()} clusterId={1} />
    );
    const { rerender } = renderWithBrowserRouter(<Proxy />, {
      route: "/kvm",
      store,
    });

    // Cluster is being deleted - form shouldn't be saved yet.
    expect(screen.getByTestId("saving-label")).toHaveTextContent(
      "Removing cluster..."
    );

    // Mock the change from deleting the cluster to no longer deleting the
    // cluster including an error, then rerender the component.
    jest.spyOn(vmClusterSelectors, "status").mockReturnValue(false);
    jest.spyOn(vmClusterSelectors, "eventError").mockReturnValue([
      vmClusterEventErrorFactory({
        error: "Uh oh",
        event: "delete",
      }),
    ]);
    rerender(<DeleteForm clearSidePanelContent={jest.fn()} clusterId={1} />);

    // Form should not have saved successfully.
    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Error:"
    );
    expect(screen.getByText("Uh oh")).toBeInTheDocument();
  });

  it("pods do not get marked as deleted if there is an error", () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: true }),
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = () => (
      <DeleteForm clearSidePanelContent={jest.fn()} hostId={1} />
    );
    const { rerender } = renderWithBrowserRouter(<Proxy />, {
      route: "/kvm",
      store,
    });

    // Pod is being deleted - form shouldn't be saved yet.
    expect(screen.getByTestId("saving-label")).toHaveTextContent(
      "Removing KVM host..."
    );

    // Mock the change from deleting the pod to no longer deleting the pod
    // including an error, then rerender the component.
    jest.spyOn(podSelectors, "deleting").mockReturnValue([]);
    jest.spyOn(podSelectors, "errors").mockReturnValue("Uh oh");
    rerender(<DeleteForm clearSidePanelContent={jest.fn()} hostId={1} />);

    // Form should not have saved successfully.
    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Error:"
    );
    expect(screen.getByText("Uh oh")).toBeInTheDocument();
  });
});
