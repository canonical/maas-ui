import configureStore from "redux-mock-store";

import LXDHostVMs from "./LXDHostVMs";

import { KVMSidePanelViews } from "app/kvm/constants";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podNuma as podNumaFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("LXDHostVMs", () => {
  it("shows a spinner if pod has not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);

    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/kvm/1/project", store }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can view resources by NUMA node", async () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            resources: podResourcesFactory({ numa: [podNumaFactory()] }),
          }),
        ],
      }),
    });

    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/kvm/1", state }
    );

    expect(screen.queryByTestId("numa-resources")).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("numa-switch"));

    expect(screen.getByTestId("numa-resources")).toBeInTheDocument();
  });

  it("displays the host name when in a cluster", async () => {
    const pod = podFactory({ id: 1, name: "cluster host" });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    renderWithBrowserRouter(
      <LXDHostVMs
        clusterId={2}
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/kvm/1", state }
    );
    expect(screen.getByTestId("toolbar-title")).toHaveTextContent(
      `VMs on ${pod.name}`
    );
  });

  it("does not display the host name when in a single host", async () => {
    const pod = podFactory({ id: 1, name: "cluster host" });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/kvm/1", state }
    );
    expect(screen.getByTestId("toolbar-title")).toHaveTextContent(
      `VMs on this host`
    );
  });

  it("can open the compose VM form", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    const setSidePanelContent = jest.fn();
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={setSidePanelContent}
      />,
      { route: "/kvm/1", store }
    );

    await userEvent.click(screen.getByTestId("add-vm"));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.COMPOSE_VM,
      extras: {
        hostId: 1,
      },
    });
  });

  it("fetches VMs for the host", async () => {
    const pod = podFactory({ id: 1, name: "cluster host" });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    const store = mockStore(state);

    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { store }
    );
    const expected = machineActions.fetch("123456", {
      filter: { pod: [pod.name] },
    });

    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches[fetches.length - 1].payload.params.filter).toStrictEqual({
      pod: [pod.name],
    });
  });
});
