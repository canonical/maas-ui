import configureStore from "redux-mock-store";
import type { Mock } from "vitest";

import VMsTable from "./VMsTable";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
  waitForLoading,
  within,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("VMsTable", () => {
  let getResources: Mock;

  beforeEach(() => {
    getResources = vi.fn().mockReturnValue({
      hugepagesBacked: false,
      pinnedCores: [],
      unpinnedCores: 0,
    });
  });

  it("can change sort order", async () => {
    const vms = [
      factory.machine({ fqdn: "b", system_id: "b", hostname: "b" }),
      factory.machine({ fqdn: "c", system_id: "c", hostname: "c" }),
      factory.machine({ fqdn: "a", system_id: "a", hostname: "a" }),
    ];
    const state = factory.rootState({
      machine: factory.machineState({
        items: vms,
        lists: {
          "mocked-nanoid": factory.machineStateList({
            loaded: true,
            groups: [
              factory.machineStateListGroup({
                items: vms.map(({ system_id }) => system_id),
              }),
            ],
          }),
        },
      }),
    });
    renderWithProviders(
      <VMsTable getResources={getResources} isPending={false} vms={vms} />,
      { state, initialEntries: ["/kvm/1/project"] }
    );
    await waitForLoading();
    // Sorted ascending by hostname
    await userEvent.click(screen.getByRole("button", { name: /VM name/i }));
    const rows = within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row");

    expect(within(rows[0]).getAllByRole("cell")[1]).toHaveTextContent(/c/i);
    expect(within(rows[1]).getAllByRole("cell")[1]).toHaveTextContent(/b/i);
    expect(within(rows[2]).getAllByRole("cell")[1]).toHaveTextContent(/a/i);
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
        selected: null,
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
