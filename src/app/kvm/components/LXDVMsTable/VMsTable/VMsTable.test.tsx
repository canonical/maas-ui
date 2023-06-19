import reduxToolkit from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";

import VMsTable, { Label } from "./VMsTable";

import { SortDirection } from "app/base/types";
import { FetchGroupKey } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "testing/factories";
import {
  screen,
  within,
  renderWithMockStore,
  userEvent,
  renderWithBrowserRouter,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("VMsTable", () => {
  let getResources: jest.Mock;

  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    getResources = jest.fn().mockReturnValue({
      hugepagesBacked: false,
      pinnedCores: [],
      unpinnedCores: 0,
    });
  });

  it("displays skeleton rows when loading", () => {
    renderWithMockStore(
      <VMsTable
        getHostColumn={undefined}
        getResources={getResources}
        machinesLoading={true}
        pods={[]}
        searchFilter=""
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={[]}
      />
    );
    expect(
      within(
        screen.getAllByRole("gridcell", {
          name: Label.Name,
        })[0]
      ).getByText("xxxxxxxxx.xxxx")
    ).toBeInTheDocument();
  });

  it("can change sort order", async () => {
    const setSortKey = jest.fn();
    const setSortDirection = jest.fn();
    const vms = [
      machineFactory({ hostname: "b" }),
      machineFactory({ hostname: "c" }),
      machineFactory({ hostname: "a" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
        lists: {
          "123456": machineStateListFactory({
            loaded: true,
            groups: [
              machineStateListGroupFactory({
                items: vms.map(({ system_id }) => system_id),
              }),
            ],
          }),
        },
      }),
    });
    renderWithBrowserRouter(
      <VMsTable
        getResources={getResources}
        machinesLoading={false}
        pods={[]}
        searchFilter=""
        setSortDirection={setSortDirection}
        setSortKey={setSortKey}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Status}
        vms={vms}
      />,
      { state, route: "/kvm/1/project" }
    );
    // Sorted ascending by hostname
    await userEvent.click(screen.getByRole("button", { name: /VM name/i }));
    expect(setSortKey).toHaveBeenCalledWith(FetchGroupKey.Hostname);
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.DESCENDING);
  });

  it("can dispatch an action to select all VMs", async () => {
    const pod = podFactory({ id: 1, name: "pod-1" });
    const vms = [
      machineFactory({
        system_id: "abc123",
      }),
      machineFactory({
        system_id: "def456",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
        selected: null,
      }),
      pod: podStateFactory({ items: [pod], loaded: true }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <VMsTable
        getResources={getResources}
        machinesLoading={false}
        pods={[pod.name]}
        searchFilter=""
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={vms}
      />,
      { store, route: "/kvm/1/project" }
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: /All machines/i })
    );

    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({
      type: "machine/setSelected",
      payload: { filter: { pod: [pod.name] } },
    });
  });

  it("can dispatch an action to unselect all VMs", async () => {
    const pod = podFactory({ id: 1, name: "pod-1" });
    const vms = [
      machineFactory({
        system_id: "abc123",
      }),
      machineFactory({
        system_id: "def456",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
        selected: { filter: {} },
      }),
      pod: podStateFactory({ items: [pod], loaded: true }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <VMsTable
        getResources={getResources}
        machinesLoading={false}
        pods={[pod.name]}
        searchFilter=""
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={vms}
      />,
      { store, route: "/kvm/1/project" }
    );

    // click twice to select cnd deselect
    await userEvent.click(
      screen.getByRole("checkbox", { name: /All machines/i })
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: /All machines/i })
    );

    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({
      type: "machine/setSelected",
      payload: null,
    });
  });

  it("shows a message if no VMs in a KVM host match the search filter", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });

    renderWithBrowserRouter(
      <VMsTable
        getResources={getResources}
        machinesLoading={false}
        pods={[]}
        searchFilter="system_id:(=ghi789)"
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={[]}
      />,
      { state, route: "/kvm/1/project" }
    );

    expect(screen.getByTestId("no-vms")).toBeInTheDocument();
    expect(screen.getByTestId("no-vms")).toHaveTextContent(
      "No VMs in this KVM host match the search criteria."
    );
  });

  it("shows a message if no VMs in a cluster match the search filter", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });

    renderWithBrowserRouter(
      <VMsTable
        displayForCluster
        getResources={getResources}
        machinesLoading={false}
        pods={[]}
        searchFilter="system_id:(=ghi789)"
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={[]}
      />,
      { state, route: "/kvm/1/project" }
    );

    expect(screen.getByTestId("no-vms")).toBeInTheDocument();
    expect(screen.getByTestId("no-vms")).toHaveTextContent(
      "No VMs in this cluster match the search criteria."
    );
  });

  it("renders a column for the host if function provided to render it", () => {
    const state = rootStateFactory();

    renderWithBrowserRouter(
      <VMsTable
        getHostColumn={jest.fn()}
        getResources={getResources}
        machinesLoading={false}
        pods={[]}
        searchFilter=""
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={[]}
      />,
      { state, route: "/kvm/1/project" }
    );

    expect(
      screen.getByRole("columnheader", { name: /KVM host/i })
    ).toBeInTheDocument();
  });

  it("does not render a column for the host if no function provided to render it", () => {
    const state = rootStateFactory();

    renderWithBrowserRouter(
      <VMsTable
        getHostColumn={undefined}
        getResources={getResources}
        machinesLoading={false}
        pods={[]}
        searchFilter=""
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={[]}
      />,
      { state, route: "/kvm/1/project" }
    );

    expect(
      screen.queryByRole("columnheader", { name: /KVM host/i })
    ).not.toBeInTheDocument();
  });

  it("displays tag names", () => {
    const vms = [machineFactory({ tags: [1, 2] })];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
      }),
      tag: tagStateFactory({
        items: [
          tagFactory({ id: 1, name: "tag1" }),
          tagFactory({ id: 2, name: "tag2" }),
        ],
      }),
    });

    renderWithBrowserRouter(
      <VMsTable
        getResources={getResources}
        machinesLoading={false}
        pods={[]}
        searchFilter=""
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={vms}
      />,
      { state, route: "/kvm/1/project" }
    );

    const poolCell = screen.getByRole("gridcell", { name: /Pool/i });
    expect(within(poolCell).getByTestId("secondary")).toHaveTextContent(
      "tag1, tag2"
    );
  });

  it("renders a column for the host if function provided to render it", () => {
    const state = rootStateFactory();

    renderWithBrowserRouter(
      <VMsTable
        getHostColumn={jest.fn()}
        getResources={getResources}
        machinesLoading={false}
        pods={[]}
        searchFilter=""
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection={SortDirection.DESCENDING}
        sortKey={FetchGroupKey.Hostname}
        vms={[]}
      />,
      { state, route: "/kvm/1/project" }
    );

    expect(
      screen.getByRole("columnheader", { name: /KVM host/i })
    ).toBeInTheDocument();
  });
});
