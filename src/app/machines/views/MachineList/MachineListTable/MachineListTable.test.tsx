import reduxToolkit from "@reduxjs/toolkit";
import { screen, within } from "@testing-library/react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { MachineListTable, Label } from "./MachineListTable";

import { SortDirection } from "app/base/types";
import { MachineColumns, columnLabels } from "app/machines/constants";
import type { Machine } from "app/store/machine/types";
import { FetchGroupKey } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineActionsState as machineActionsStateFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "testing/factories";
import { renderWithBrowserRouter, renderWithMockStore } from "testing/utils";

const mockStore = configureStore();

describe("MachineListTable", () => {
  let state: RootState;
  let machines: Machine[] = [];

  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    machines = [
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 4,
        cpu_test_status: testStatusFactory({
          status: TestStatusStatus.RUNNING,
        }),
        distro_series: "bionic",
        domain: modelRefFactory({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "koala.example",
        hostname: "koala",
        ip_addresses: [],
        memory: 8,
        memory_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        network_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        osystem: "ubuntu",
        owner: "admin",
        physical_disk_count: 1,
        pool: modelRefFactory(),
        pxe_mac: "00:11:22:33:44:55",
        spaces: [],
        status: NodeStatus.DEPLOYED,
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 8,
        storage_test_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        testing_status: testStatusFactory({
          status: TestStatusStatus.PASSED,
        }),
        system_id: "abc123",
        zone: modelRefFactory(),
      }),
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 2,
        cpu_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        distro_series: "xenial",
        domain: modelRefFactory({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "other.example",
        hostname: "other",
        ip_addresses: [],
        memory: 6,
        memory_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        network_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        osystem: "ubuntu",
        owner: "user",
        physical_disk_count: 2,
        pool: modelRefFactory(),
        pxe_mac: "66:77:88:99:00:11",
        spaces: [],
        status: NodeStatus.RELEASING,
        status_code: NodeStatusCode.RELEASING,
        status_message: "",
        storage: 16,
        storage_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        testing_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        system_id: "def456",
        zone: modelRefFactory(),
      }),
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 2,
        cpu_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        distro_series: "xenial",
        domain: modelRefFactory({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "other.example",
        hostname: "other",
        ip_addresses: [],
        memory: 6,
        memory_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        network_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        osystem: "ubuntu",
        owner: "user",
        physical_disk_count: 2,
        pool: modelRefFactory(),
        pxe_mac: "66:77:88:99:00:11",
        spaces: [],
        status: NodeStatus.RELEASING,
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 16,
        storage_test_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        testing_status: testStatusFactory({
          status: TestStatusStatus.FAILED,
        }),
        system_id: "ghi789",
        zone: modelRefFactory(),
      }),
    ];
    state = rootStateFactory({
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data: [],
        }),
        osInfo: osInfoStateFactory({
          data: osInfoFactory({
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          }),
          loaded: true,
        }),
      }),
      machine: machineStateFactory({
        items: machines,
        lists: {
          "123456": machineStateListFactory({
            loading: true,
            groups: [
              machineStateListGroupFactory({
                items: [machines[0].system_id, machines[2].system_id],
                name: "Deployed",
              }),
              machineStateListGroupFactory({
                items: [machines[1].system_id],
                name: "Releasing",
              }),
            ],
          }),
        },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({
            id: 0,
            name: "default",
          }),
          resourcePoolFactory({
            id: 1,
            name: "Backup",
          }),
        ],
      }),
      zone: zoneStateFactory({
        items: [
          zoneFactory({
            id: 0,
            name: "default",
          }),
          zoneFactory({
            id: 1,
            name: "Backup",
          }),
        ],
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("displays skeleton rows when loading", () => {
    renderWithMockStore(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={FetchGroupKey.Status}
        hiddenGroups={[]}
        machineCount={10}
        machines={machines}
        machinesLoading
        pageSize={20}
        setCurrentPage={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection="none"
        sortKey={null}
      />,
      { state }
    );
    expect(
      within(
        screen.getAllByRole("gridcell", {
          name: columnLabels[MachineColumns.FQDN],
        })[0]
      ).getByText("xxxxxxxxx.xxxx")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("grid", {
        name: Label.Loading,
      })
    ).toHaveClass("machine-list--loading");
  });

  it("displays a message if there are no search results", () => {
    state.machine = machineStateFactory({
      items: [],
      lists: {
        "123456": machineStateListFactory({
          loading: false,
          groups: [],
        }),
      },
    });
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter="this does not match anything"
        grouping={FetchGroupKey.Status}
        hiddenGroups={[]}
        machineCount={10}
        machines={machines}
        pageSize={20}
        setCurrentPage={jest.fn()}
        setHiddenGroups={jest.fn()}
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        sortDirection="none"
        sortKey={null}
      />,
      { state }
    );
    expect(screen.getByText(Label.NoResults)).toBeInTheDocument();
  });

  it("includes groups", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              grouping={FetchGroupKey.Status}
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection="none"
              sortKey={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find(".machine-list__group").at(0).find("strong").text()
    ).toBe("Deployed");
    expect(
      wrapper.find(".machine-list__group").at(2).find("strong").text()
    ).toBe("Releasing");
  });

  it("does not display a group header if the table is ungrouped", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              grouping={null}
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection="none"
              sortKey={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".machine-list__group")).toHaveLength(0);
  });

  it("can change machines to display PXE MAC instead of FQDN", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              grouping={FetchGroupKey.Status}
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection="none"
              sortKey={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const firstMachine = machines[0];
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("MachineCheckbox")
        .text()
    ).toEqual(firstMachine.fqdn);
    // Click the MAC table header
    wrapper.find('[data-testid="mac-header"]').find("button").simulate("click");
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("MachineCheckbox")
        .at(0)
        .text()
    ).toEqual(firstMachine.pxe_mac);
  });

  it("updates sort on header click", () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={setSortDirection}
              setSortKey={setSortKey}
              sortDirection="none"
              sortKey={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click the cores table header
    wrapper
      .find('[data-testid="cores-header"]')
      .find("button")
      .simulate("click");
    expect(setSortKey).toHaveBeenCalledWith(FetchGroupKey.CpuCount);
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.DESCENDING);
  });

  it("clears the sort when the same header is clicked and is ascending", () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={setSortDirection}
              setSortKey={setSortKey}
              sortDirection={SortDirection.ASCENDING}
              sortKey={FetchGroupKey.CpuCount}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click the cores table header
    wrapper
      .find('[data-testid="cores-header"]')
      .find("button")
      .simulate("click");
    expect(setSortKey).toHaveBeenCalledWith(null);
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.NONE);
  });

  it("updates the sort when the same header is clicked and is descending", () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={setSortDirection}
              setSortKey={setSortKey}
              sortDirection={SortDirection.DESCENDING}
              sortKey={FetchGroupKey.CpuCount}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click the cores table header
    wrapper
      .find('[data-testid="cores-header"]')
      .find("button")
      .simulate("click");
    expect(setSortKey).not.toHaveBeenCalled();
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.ASCENDING);
  });

  it("updates the sort when the same header is clicked and direction is not set", () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={setSortDirection}
              setSortKey={setSortKey}
              sortDirection={SortDirection.NONE}
              sortKey={FetchGroupKey.CpuCount}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click the cores table header
    wrapper
      .find('[data-testid="cores-header"]')
      .find("button")
      .simulate("click");
    expect(setSortKey).not.toHaveBeenCalled();
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.ASCENDING);
  });

  it("updates the sort when a different header is clicked", () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={setSortDirection}
              setSortKey={setSortKey}
              sortDirection={SortDirection.NONE}
              sortKey={FetchGroupKey.CpuCount}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click the cores table header
    wrapper
      .find('[data-testid="power-header"]')
      .find("button")
      .simulate("click");
    expect(setSortKey).toHaveBeenCalledWith(FetchGroupKey.PowerState);
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.DESCENDING);
  });

  it("displays correct selected string in group header", () => {
    machines[1].status_code = NodeStatusCode.DEPLOYED;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              filter=""
              grouping={FetchGroupKey.Status}
              hiddenGroups={[]}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setHiddenGroups={jest.fn()}
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              sortDirection="none"
              sortKey={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("[data-testid='group-cell'] .p-double-row__secondary-row")
        .at(0)
        .text()
    ).toEqual("15 machines");
  });

  it("does not show checkboxes if showActions is false", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              callId="123456"
              currentPage={1}
              machineCount={10}
              machines={machines}
              pageSize={20}
              setCurrentPage={jest.fn()}
              setSortDirection={jest.fn()}
              setSortKey={jest.fn()}
              showActions={false}
              sortDirection="none"
              sortKey={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-testid='all-machines-checkbox'] input").exists()
    ).toBe(false);
    expect(wrapper.find("[data-testid='group-cell'] input").exists()).toBe(
      false
    );
    expect(wrapper.find("[data-testid='name-column'] input").exists()).toBe(
      false
    );
  });

  describe("hiddenColumns", () => {
    it("can hide columns", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                callId="123456"
                currentPage={1}
                hiddenColumns={["power", "zone"]}
                machineCount={10}
                machines={machines}
                pageSize={20}
                setCurrentPage={jest.fn()}
                setSortDirection={jest.fn()}
                setSortKey={jest.fn()}
                sortDirection="none"
                sortKey={null}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('[data-testid="status-header"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="status-column"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="power-header"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="power-column"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="zone-header"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="zone-column"]').exists()).toBe(false);
    });

    it("still displays fqdn if showActions is true", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                callId="123456"
                currentPage={1}
                hiddenColumns={["fqdn"]}
                machineCount={10}
                machines={machines}
                pageSize={20}
                setCurrentPage={jest.fn()}
                setSortDirection={jest.fn()}
                setSortKey={jest.fn()}
                showActions
                sortDirection="none"
                sortKey={null}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('[data-testid="fqdn-header"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="fqdn-column"]').exists()).toBe(true);
    });

    it("hides fqdn if if showActions is false", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                callId="123456"
                currentPage={1}
                hiddenColumns={["fqdn"]}
                machineCount={10}
                machines={machines}
                pageSize={20}
                setCurrentPage={jest.fn()}
                setSortDirection={jest.fn()}
                setSortKey={jest.fn()}
                showActions={false}
                sortDirection="none"
                sortKey={null}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('[data-testid="fqdn-header"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="fqdn-column"]').exists()).toBe(false);
    });
  });
});
