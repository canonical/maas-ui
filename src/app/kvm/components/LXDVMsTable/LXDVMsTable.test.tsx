import { waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";
import type { Mock } from "vitest";

import LXDVMsTable from "./LXDVMsTable";

import { machineActions } from "@/app/store/machine";
import { FetchGroupKey, FetchSortDirection } from "@/app/store/machine/types";
import * as query from "@/app/store/machine/utils/query";
import { generateCallId } from "@/app/store/machine/utils/query";
import * as factory from "@/testing/factories";
import {
  render,
  renderWithProviders,
  screen,
  userEvent,
  waitForLoading,
} from "@/testing/utils";

const mockStore = configureStore();

vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});

describe("LXDVMsTable", () => {
  let getResources: Mock;

  beforeEach(() => {
    vi.spyOn(query, "generateCallId").mockReturnValue("123456");
    getResources = vi.fn().mockReturnValue({
      hugepagesBacked: false,
      pinnedCores: [],
      unpinnedCores: 0,
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches machines on load", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={vi.fn()}
            pods={["pod1"]}
            searchFilter=""
            setSearchFilter={vi.fn()}
            setSidePanelContent={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    const options = {
      filter: { pod: ["pod1"] },
      group_collapsed: undefined,
      group_key: null,
      page_number: 1,
      page_size: 10,
      sort_direction: FetchSortDirection.Ascending,
      sort_key: FetchGroupKey.Hostname,
    };
    const expectedAction = machineActions.fetch(generateCallId(options), {
      ...options,
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("clears machine selected state on unmount", async () => {
    const state = factory.rootState();
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={vi.fn()}
            pods={["pod1"]}
            searchFilter=""
            setSearchFilter={vi.fn()}
            setSidePanelContent={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    unmount();

    const expectedAction = machineActions.setSelected(null);
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("shows an add VM button if function provided", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={vi.fn()}
            onAddVMClick={vi.fn()}
            pods={["pod1"]}
            searchFilter=""
            setSearchFilter={vi.fn()}
            setSidePanelContent={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("button", { name: "Add VM" })).toBeInTheDocument();
  });

  it("does not show an add VM button if no function provided", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={vi.fn()}
            pods={["pod1"]}
            searchFilter=""
            setSearchFilter={vi.fn()}
            setSidePanelContent={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("button", { name: "Add VM" })
    ).not.toBeInTheDocument();
  });

  it.skip("can change sort order", async () => {
    const vms = [
      factory.machine({ fqdn: "b", system_id: "b", hostname: "b" }),
      factory.machine({ fqdn: "c", system_id: "c", hostname: "c" }),
      factory.machine({ fqdn: "a", system_id: "a", hostname: "a" }),
    ];
    const pod = factory.pod({
      id: 1,
      name: "pod-1",
      resources: factory.podResources({
        vms: vms.map((vm) => factory.podVM({ system_id: vm.system_id })),
      }),
    });

    const state = factory.rootState({
      machine: factory.machineState({
        items: vms,
        lists: {
          "123456": factory.machineStateList({
            loaded: true,
            groups: [
              factory.machineStateListGroup({
                items: vms.map(({ system_id }) => system_id),
              }),
            ],
          }),
        },
      }),
      pod: factory.podState({ items: [pod], loaded: true }),
    });

    const store = mockStore(state);
    renderWithProviders(
      <LXDVMsTable
        getResources={getResources}
        pods={["pod-1"]}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      {
        store,
        initialEntries: ["/kvm/1/project"],
      }
    );

    await waitForLoading();

    // Sorted ascending by hostname
    await userEvent.click(screen.getByRole("button", { name: /VM name/i }));
  });

  it("can dispatch an action to select all VMs", async () => {
    const pod = factory.pod({ id: 1, name: "pod-1" });
    const vms = [
      factory.machine({
        system_id: "abc123",
      }),
      factory.machine({
        system_id: "def456",
      }),
    ];
    const state = factory.rootState({
      machine: factory.machineState({
        items: vms,
        lists: {
          "123456": factory.machineStateList({
            loaded: true,
            groups: [
              factory.machineStateListGroup({
                items: vms.map(({ system_id }) => system_id),
              }),
            ],
          }),
        },
      }),
      pod: factory.podState({ items: [pod], loaded: true }),
    });
    const store = mockStore(state);
    renderWithProviders(
      <VMsTable getResources={getResources} isPending={false} vms={vms} />,
      { store, initialEntries: ["/kvm/1/project"] }
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: /select all/i })
    );

    await waitFor(() => {
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/setSelected")
      ).toStrictEqual({
        type: "machine/setSelected",
        payload: { items: [vms[0].system_id, vms[1].system_id] },
      });
    });
  });

  it("can dispatch an action to unselect all VMs", async () => {
    const pod = factory.pod({ id: 1, name: "pod-1" });
    const vms = [
      factory.machine({
        system_id: "abc123",
      }),
      factory.machine({
        system_id: "def456",
      }),
    ];
    const state = factory.rootState({
      machine: factory.machineState({
        items: vms,
        selected: { items: vms.map((vm) => vm.system_id) },
      }),
      pod: factory.podState({ items: [pod], loaded: true }),
    });
    const store = mockStore(state);
    renderWithProviders(
      <VMsTable getResources={getResources} isPending={false} vms={vms} />,
      { store, initialEntries: ["/kvm/1/project"] }
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: /select all/i })
    );

    await waitFor(() => {
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/setSelected")
      ).toStrictEqual({
        type: "machine/setSelected",
        payload: { items: [] },
      });
    });
  });

  it("shows a message if no VMs in a KVM host match the search filter", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [],
      }),
    });

    renderWithProviders(
      <VMsTable getResources={getResources} isPending={false} vms={[]} />,
      { state, initialEntries: ["/kvm/1/project"] }
    );

    expect(
      screen.getByText(/No VMs in this KVM host match the search criteria/i)
    ).toBeInTheDocument();
  });

  it("shows a message if no VMs in a cluster match the search filter", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [],
      }),
    });

    renderWithProviders(
      <VMsTable
        displayForCluster
        getResources={getResources}
        isPending={false}
        vms={[]}
      />,
      { state, initialEntries: ["/kvm/1/project"] }
    );

    expect(
      screen.getByText(/No VMs in this cluster match the search criteria/i)
    ).toBeInTheDocument();
  });

  it("renders a column for the host if function provided to render it", () => {
    const state = factory.rootState();

    renderWithProviders(
      <VMsTable
        getHostColumn={vi.fn()}
        getResources={getResources}
        isPending={false}
        vms={[]}
      />,
      { state, initialEntries: ["/kvm/1/project"] }
    );

    expect(
      screen.getByRole("columnheader", { name: /KVM host/i })
    ).toBeInTheDocument();
  });

  it("does not render a column for the host if no function provided to render it", () => {
    const state = factory.rootState();

    renderWithProviders(
      <VMsTable
        getHostColumn={undefined}
        getResources={getResources}
        isPending={false}
        vms={[]}
      />,
      { state, initialEntries: ["/kvm/1/project"] }
    );

    expect(
      screen.queryByRole("columnheader", { name: /KVM host/i })
    ).not.toBeInTheDocument();
  });

  it("displays tag names", async () => {
    const vms = [factory.machine({ tags: [1, 2] })];
    const state = factory.rootState({
      machine: factory.machineState({
        items: vms,
      }),
      tag: factory.tagState({
        items: [
          factory.tag({ id: 1, name: "tag1" }),
          factory.tag({ id: 2, name: "tag2" }),
        ],
      }),
    });

    renderWithProviders(
      <VMsTable getResources={getResources} isPending={false} vms={vms} />,
      { state, initialEntries: ["/kvm/1/project"] }
    );

    expect(screen.getByText("tag1, tag2")).toBeInTheDocument();
  });

  it("shows a message if table is empty", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [],
      }),
    });

    renderWithProviders(
      <VMsTable getResources={getResources} isPending={false} vms={[]} />,
      { state, initialEntries: ["/kvm/1/project"] }
    );

    expect(
      screen.getByText(/No VMs in this KVM host match the search criteria/i)
    ).toBeInTheDocument();
  });
});
