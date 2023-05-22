import configureStore from "redux-mock-store";

import LXDHostVMs from "./LXDHostVMs";

import { KVMHeaderViews } from "app/kvm/constants";
import { actions as machineActions } from "app/store/machine";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  pod as podFactory,
  podNuma as podNumaFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVM as podVMFactory,
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

  it("can get resources for a VM", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            resources: podResourcesFactory({
              vms: [
                podVMFactory({
                  hugepages_backed: true,
                  pinned_cores: [3],
                  system_id: "abc123",
                  unpinned_cores: 8,
                }),
              ],
            }),
            type: PodType.LXD,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);

    const { getResources } = renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/kvm/1/project", store }
    );

    expect(getResources(machineFactory({ system_id: "abc123" }))).toStrictEqual(
      {
        hugepagesBacked: true,
        pinnedCores: [3],
        unpinnedCores: 8,
      }
    );
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
    const store = mockStore(state);

    const { container } = renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/kvm/1", store }
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
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <LXDHostVMs
        clusterId={2}
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/kvm/1", store }
    );
    const title = container.querySelector(".title-header")?.textContent;
    expect(title && title.includes(pod.name)).toBe(true);
  });

  it("does not display the host name when in a single host", async () => {
    const pod = podFactory({ id: 1, name: "cluster host" });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: "/kvm/1", store }
    );
    const title = container.querySelector(".title-header")?.textContent;
    expect(title && title.includes(pod.name)).toBe(false);
  });

  it("can open the compose VM form", () => {
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

    userEvent.click(screen.getByTestId("add-vm"));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.COMPOSE_VM,
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
