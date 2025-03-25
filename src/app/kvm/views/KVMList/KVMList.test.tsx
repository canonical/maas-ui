import configureStore from "redux-mock-store";

import KVMList from "./KVMList";

import urls from "@/app/base/urls";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  renderWithProviders,
  screen,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("KVMList", () => {
  it("correctly fetches the necessary data", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    renderWithProviders(<KVMList />, {
      route: "/kvm",
      store,
    });
    const expectedActions = ["pod/fetch", "vmcluster/fetch"];
    const actualActions = store.getActions();
    expect(
      expectedActions.every((expectedAction) =>
        actualActions.some((action) => action.type === expectedAction)
      )
    ).toBe(true);
  });

  it("shows a LXD table when viewing the LXD tab and there are LXD pods", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [factory.pod({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    renderWithProviders(<KVMList />, {
      route: urls.kvm.lxd.index,
      store,
    });

    expect(screen.getByTestId("lxd-table")).toBeInTheDocument();
  });

  it("shows a LXD table when viewing the LXD tab and there are clusters", () => {
    const state = factory.rootState({
      vmcluster: factory.vmClusterState({
        items: [factory.vmCluster()],
      }),
    });
    const store = mockStore(state);
    renderWithProviders(<KVMList />, {
      route: urls.kvm.lxd.index,
      store,
    });

    expect(screen.getByTestId("lxd-table")).toBeInTheDocument();
  });

  it("shows a virsh table when viewing the Virsh tab", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [factory.pod({ type: PodType.VIRSH })],
      }),
    });
    const store = mockStore(state);
    renderWithProviders(<KVMList />, {
      route: urls.kvm.virsh.index,
      store,
    });

    expect(screen.getByTestId("virsh-table")).toBeInTheDocument();
  });

  it("redirects to the LXD tab if not already on a tab", async () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [factory.pod({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMList />, {
      route: urls.kvm.index,
      store,
    });

    expect(document.title).toEqual(expect.stringContaining("LXD"));
    expect(window.location.pathname).toEqual(urls.kvm.lxd.index);
  });

  it("displays a message if there are no LXD KVMs", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [],
      }),
    });
    const store = mockStore(state);
    renderWithProviders(<KVMList />, {
      route: urls.kvm.lxd.index,
      store,
    });

    expect(document.title).toEqual(expect.stringContaining("LXD"));
    expect(screen.getByTestId("no-hosts")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /No LXD hosts available/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Select the Add LXD host button and add the LXD host to see hosts on this page./i
      )
    ).toBeInTheDocument();
  });

  it("displays a message if there are no Virsh KVMs", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [],
      }),
    });
    renderWithProviders(<KVMList />, {
      route: urls.kvm.virsh.index,
      state,
    });

    expect(document.title).toEqual(expect.stringContaining("Virsh"));
    expect(screen.getByTestId("no-hosts")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /No Virsh hosts available/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Select the Add Virsh host button and add the Virsh host to see hosts on this page./i
      )
    ).toBeInTheDocument();
  });

  it("displays a spinner when loading pods", () => {
    const state = factory.rootState({
      pod: factory.podState({
        loading: true,
      }),
    });
    renderWithProviders(<KVMList />, {
      route: urls.kvm.index,
      state,
    });

    expect(screen.queryByTestId("no-hosts")).not.toBeInTheDocument();
    expect(screen.getAllByText(/Loading/i)).toHaveLength(2);
    expect(
      screen.queryByText(/No LXD hosts available/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/No Virsh hosts available/i)
    ).not.toBeInTheDocument();
  });
});
