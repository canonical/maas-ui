import reduxToolkit from "@reduxjs/toolkit";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import VMsTable from "./VMsTable";

import { SortDirection } from "app/base/types";
import { FetchGroupKey } from "app/store/machine/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "testing/factories";

const mockStore = configureStore();

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

  it("shows a spinner if machines are loading", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              getResources={getResources}
              machinesLoading={true}
              searchFilter=""
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Hostname}
              vms={[]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can change sort order", () => {
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              getResources={getResources}
              machinesLoading={false}
              searchFilter=""
              setSortDirection={setSortDirection}
              setSortKey={setSortKey}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Status}
              vms={vms}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Sorted ascending by hostname
    wrapper.find("[data-testid='name-header']").simulate("click");
    expect(setSortKey).toHaveBeenCalledWith(FetchGroupKey.Hostname);
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.DESCENDING);
  });

  it("can dispatch an action to select all VMs", () => {
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
        selectedMachines: null,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              getResources={getResources}
              machinesLoading={false}
              searchFilter=""
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Hostname}
              vms={vms}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("AllCheckbox input").simulate("change", {
      target: { checked: "checked" },
    });
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/setSelectedMachines")
    ).toStrictEqual({
      type: "machine/setSelectedMachines",
      payload: { filter: {} },
    });
  });

  it("can dispatch an action to unselect all VMs", () => {
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
        selectedMachines: { filter: {} },
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              getResources={getResources}
              machinesLoading={false}
              searchFilter=""
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Hostname}
              vms={vms}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("AllCheckbox input").simulate("change", {
      target: { checked: "" },
    });
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/setSelectedMachines")
    ).toStrictEqual({
      type: "machine/setSelectedMachines",
      payload: null,
    });
  });

  it("shows a message if no VMs in a KVM host match the search filter", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              getResources={getResources}
              machinesLoading={false}
              searchFilter="system_id:(=ghi789)"
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Hostname}
              vms={[]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='no-vms']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='no-vms']").text()).toBe(
      "No VMs in this KVM host match the search criteria."
    );
  });

  it("shows a message if no VMs in a cluster match the search filter", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              displayForCluster
              getResources={getResources}
              machinesLoading={false}
              searchFilter="system_id:(=ghi789)"
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Hostname}
              vms={[]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='no-vms']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='no-vms']").text()).toBe(
      "No VMs in this cluster match the search criteria."
    );
  });

  it("renders a column for the host if function provided to render it", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              getHostColumn={jest.fn()}
              getResources={getResources}
              machinesLoading={false}
              searchFilter=""
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Hostname}
              vms={[]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='host-column']").exists()).toBe(true);
  });

  it("does not render a column for the host if no function provided to render it", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              getHostColumn={undefined}
              getResources={getResources}
              machinesLoading={false}
              searchFilter=""
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Hostname}
              vms={[]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='host-column']").exists()).toBe(false);
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <CompatRouter>
            <VMsTable
              getResources={getResources}
              machinesLoading={false}
              searchFilter=""
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.Hostname}
              vms={vms}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("DoubleRow[data-testid='pool-col']").at(0).prop("secondary")
    ).toBe("tag1, tag2");
  });
});
