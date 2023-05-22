import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterHostsTable from "./LXDClusterHostsTable";

import urls from "app/base/urls";
import { KVMHeaderViews } from "app/kvm/constants";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("LXDClusterHostsTable", () => {
  let state: RootState;
  beforeEach(() => {
    const host = podFactory({
      cluster: 1,
      id: 22,
      name: "cluster-host",
      pool: 333,
      type: PodType.LXD,
    });
    state = rootStateFactory({
      pod: podStateFactory({
        items: [host],
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory({ id: 333, name: "swimming" })],
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            hosts: [vmHostFactory({ id: host.id, name: host.name })],
          }),
        ],
      }),
    });
  });

  it("shows a spinner if pods or pools haven't loaded yet", () => {
    const store = mockStore(state);
    state.resourcepool.loaded = false;
    const { getByTestId } = render(
      renderWithBrowserRouter(
        <LXDClusterHostsTable
          clusterId={1}
          currentPage={1}
          hosts={state.pod.items}
          searchFilter=""
          setSidePanelContent={jest.fn()}
        />,
        { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), store }
      )
    );
    expect(getByTestId("loading")).toBeInTheDocument();
  });

  it("can link to a host's VMs tab", () => {
    const store = mockStore(state);
    const { getByRole } = render(
      renderWithBrowserRouter(
        <LXDClusterHostsTable
          clusterId={1}
          currentPage={1}
          hosts={state.pod.items}
          searchFilter=""
          setSidePanelContent={jest.fn()}
        />,
        { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), store }
      )
    );
    expect(getByRole("link", { name: "NameColumn" })).toHaveAttribute(
      "href",
      urls.kvm.lxd.cluster.vms.host({ clusterId: 1, hostId: 22 })
    );
  });

  it("can show the name of the host's pool", () => {
    const store = mockStore(state);
    const { getByTestId } = render(
      renderWithBrowserRouter(
        <LXDClusterHostsTable
          clusterId={1}
          currentPage={1}
          hosts={state.pod.items}
          searchFilter=""
          setSidePanelContent={jest.fn()}
        />,
        { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), store }
      )
    );
    expect(getByTestId("host-pool-name")).toHaveTextContent("swimming");
  });

  it("can open the compose VM form for a host", () => {
    const setSidePanelContent = jest.fn();
    const store = mockStore(state);
    const { getByTestId } = render(
      renderWithBrowserRouter(
        <LXDClusterHostsTable
          clusterId={1}
          currentPage={1}
          hosts={state.pod.items}
          searchFilter=""
          setSidePanelContent={setSidePanelContent}
        />,
        { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), store }
      )
    );
    userEvent.click(getByTestId("vm-host-compose"));
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.COMPOSE_VM,
      extras: { hostId: 22 },
    });
  });

  it("can link to a host's settings page", () => {
    const store = mockStore(state);
    const { getByTestId } = render(
      renderWithBrowserRouter(
        <LXDClusterHostsTable
          clusterId={1}
          currentPage={1}
          hosts={state.pod.items}
          searchFilter=""
          setSidePanelContent={jest.fn()}
        />,
        { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), store }
      )
    );
    expect(getByTestId("vm-host-settings")).toHaveAttribute(
      "href",
      urls.kvm.lxd.cluster.host.edit({ clusterId: 1, hostId: 22 })
    );
    expect(getByTestId("vm-host-settings")).toHaveAttribute(
      "data-from",
      urls.kvm.lxd.cluster.hosts({ clusterId: 1 })
    );
  });

  it("displays a message if there are no search results", () => {
    const store = mockStore(state);
    const { getByTestId } = render(
      renderWithBrowserRouter(
        <LXDClusterHostsTable
          clusterId={1}
          currentPage={1}
          hosts={[]}
          searchFilter="nothing"
          setSidePanelContent={jest.fn()}
        />,
        { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), store }
      )
    );
    expect(getByTestId("no-hosts")).toBeInTheDocument();
  });
});
