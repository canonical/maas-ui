import configureStore from "redux-mock-store";

import KVMList from "./KVMList";

import urls from "app/base/urls";
import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("KVMList", () => {
  it("correctly fetches the necessary data", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: "/kvm",
      store,
    });
    const expectedActions = [
      "pod/fetch",
      "resourcepool/fetch",
      "vmcluster/fetch",
      "zone/fetch",
    ];
    const actualActions = store.getActions();
    expect(
      expectedActions.every((expectedAction) =>
        actualActions.some((action) => action.type === expectedAction)
      )
    ).toBe(true);
  });

  it("shows a LXD table when viewing the LXD tab and there are LXD pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: urls.kvm.lxd.index,
      store,
    });

    expect(screen.getByTestId("lxd-table")).toBeInTheDocument();
  });

  it("shows a LXD table when viewing the LXD tab and there are clusters", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory()],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: urls.kvm.lxd.index,
      store,
    });

    expect(screen.getByTestId("lxd-table")).toBeInTheDocument();
  });

  it("shows a virsh table when viewing the Virsh tab", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.VIRSH })],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: urls.kvm.virsh.index,
      store,
    });

    expect(screen.getByTestId("virsh-table")).toBeInTheDocument();
  });

  it("redirects to the LXD tab if not already on a tab", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: urls.kvm.index,
      store,
    });

    expect(screen.getByTestId("lxd-table")).toBeInTheDocument();
  });

  it("displays a message if there are no LXD KVMs", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: urls.kvm.lxd.index,
      store,
    });

    expect(screen.getByTestId("no-hosts")).toBeInTheDocument();
    expect(screen.getByText(/no LXD hosts found/i)).toBeInTheDocument();
  });

  it("displays a message if there are no Virsh KVMs", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: urls.kvm.virsh.index,
      store,
    });

    expect(screen.getByTestId("no-hosts")).toBeInTheDocument();
    expect(screen.getByText(/no Virsh hosts found/i)).toBeInTheDocument();
  });

  it("displays a spinner when loading pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loading: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: urls.kvm.index,
      store,
    });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText(/no LXD hosts found/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no Virsh hosts found/i)).not.toBeInTheDocument();
  });
});
