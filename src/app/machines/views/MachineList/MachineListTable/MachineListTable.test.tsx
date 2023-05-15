import reduxToolkit from "@reduxjs/toolkit";

import { MachineListTable, Label } from "./MachineListTable";

import { SortDirection } from "app/base/types";
import { MachineColumns, columnLabels } from "app/machines/constants";
import type { Machine, MachineStateListGroup } from "app/store/machine/types";
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
  user as userFactory,
  userState as userStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "testing/factories";
import {
  userEvent,
  screen,
  within,
  renderWithBrowserRouter,
  renderWithMockStore,
} from "testing/utils";

describe("MachineListTable", () => {
  let state: RootState;
  let machines: Machine[] = [];
  let groups: MachineStateListGroup[] = [];

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
    groups = [
      machineStateListGroupFactory({
        items: [machines[0].system_id, machines[2].system_id],
        name: "Deployed",
      }),
      machineStateListGroupFactory({
        items: [machines[1].system_id],
        name: "Releasing",
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
            groups,
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
        groups={groups}
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
    groups = [];
    state.machine = machineStateFactory({
      items: [],
      lists: {
        "123456": machineStateListFactory({
          loading: false,
          groups,
        }),
      },
    });

    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter="this does not match anything"
        grouping={FetchGroupKey.Status}
        groups={groups}
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
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={FetchGroupKey.Status}
        groups={groups}
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

    expect(
      screen.queryAllByRole("row", { name: /machines group/i }).length
    ).toEqual(2);
    expect(
      screen.getByRole("row", { name: /Deployed machines group/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: /Releasing machines group/i })
    ).toBeInTheDocument();
  });

  it("does not display a group header if the table is ungrouped", () => {
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={null}
        groups={groups}
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
    expect(
      screen.queryByRole("row", { name: /machines group/i })
    ).not.toBeInTheDocument();
  });

  it("can change machines to display PXE MAC instead of FQDN", async () => {
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={null}
        groups={groups}
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

    const firstMachine = machines[0];
    expect(
      screen.getByRole("checkbox", { name: firstMachine.fqdn })
    ).toBeInTheDocument();
    const tableHeader = screen.getAllByRole("rowgroup")[0];
    // Click the MAC table header
    await userEvent.click(
      within(tableHeader).getByRole("button", { name: "MAC" })
    );
    const tableBody = screen.getAllByRole("rowgroup")[1];
    expect(within(tableBody).getAllByRole("link")[0]).toHaveTextContent(
      firstMachine.pxe_mac!
    );
  });

  it("can change machines to display full owners name instead of username", async () => {
    const user = userFactory({
      id: 1,
      username: "admin",
      last_name: "full name",
    });
    state.machine.items[0].owner = user.username;
    state.user = userStateFactory({
      items: [user],
    });
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={null}
        groups={groups}
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
    const tableBody = screen.getAllByRole("rowgroup")[1];
    const getFirstRow = () => within(tableBody).getAllByRole("row")[0];
    const getFirstMachineOwner = () =>
      within(
        within(getFirstRow()).getByRole("gridcell", { name: "Owner" })
      ).getByTestId("owner");
    expect(getFirstMachineOwner()).toHaveTextContent(user.username);
    await userEvent.click(
      within(screen.getByRole("columnheader", { name: "Owner" })).getByRole(
        "button",
        { name: /Name/ }
      )
    );
    expect(getFirstMachineOwner()).toHaveTextContent(user.last_name);
  });

  it("updates sort on header click", async () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={null}
        groups={groups}
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
      />,
      { state }
    );
    const tableHeader = screen.getAllByRole("rowgroup")[0];
    await userEvent.click(
      within(tableHeader).getByRole("button", { name: /cores/i })
    );
    expect(setSortKey).toHaveBeenCalledWith(FetchGroupKey.CpuCount);
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.DESCENDING);
  });

  it("clears the sort when the same header is clicked and is ascending", async () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={null}
        groups={groups}
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
      />,
      { state }
    );
    const tableHeader = screen.getAllByRole("rowgroup")[0];
    await userEvent.click(
      within(tableHeader).getByRole("button", { name: /cores/i })
    );
    expect(setSortKey).toHaveBeenCalledWith(null);
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.NONE);
  });

  it("updates the sort when the same header is clicked and is descending", async () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={null}
        groups={groups}
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
      />,
      { state }
    );
    const tableHeader = screen.getAllByRole("rowgroup")[0];
    await userEvent.click(
      within(tableHeader).getByRole("button", { name: /cores/i })
    );
    expect(setSortKey).not.toHaveBeenCalled();
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.ASCENDING);
  });

  it("updates the sort when the same header is clicked and direction is not set", async () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={null}
        groups={groups}
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
      />,
      { state }
    );
    const tableHeader = screen.getAllByRole("rowgroup")[0];
    await userEvent.click(
      within(tableHeader).getByRole("button", { name: /cores/i })
    );
    expect(setSortKey).not.toHaveBeenCalled();
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.ASCENDING);
  });

  it("updates the sort when a different header is clicked", async () => {
    const setSortDirection = jest.fn();
    const setSortKey = jest.fn();
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={null}
        groups={groups}
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
      />,
      { state }
    );
    const tableHeader = screen.getAllByRole("rowgroup")[0];
    await userEvent.click(
      within(tableHeader).getByRole("button", { name: /power/i })
    );
    expect(setSortKey).toHaveBeenCalledWith(FetchGroupKey.PowerState);
    expect(setSortDirection).toHaveBeenCalledWith(SortDirection.DESCENDING);
  });

  it("displays correct selected string in group header", () => {
    machines[1].status_code = NodeStatusCode.DEPLOYED;
    renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        filter=""
        grouping={FetchGroupKey.Status}
        groups={groups}
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
    expect(
      within(
        screen.getAllByRole("row", { name: /machines group/i })[0]
      ).getByText("15 machines")
    ).toBeInTheDocument();
  });

  it("does not show checkboxes if showActions is false", () => {
    const { rerender } = renderWithBrowserRouter(
      <MachineListTable
        callId="123456"
        currentPage={1}
        groups={groups}
        machineCount={10}
        machines={machines}
        pageSize={20}
        setCurrentPage={jest.fn()}
        setSortDirection={jest.fn()}
        setSortKey={jest.fn()}
        showActions={true}
        sortDirection="none"
        sortKey={null}
      />,
      { state }
    );
    expect(screen.getAllByRole("checkbox").length).toBe(4);

    rerender(
      <MachineListTable
        callId="123456"
        currentPage={1}
        groups={groups}
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
    );
    expect(screen.queryAllByRole("checkbox").length).toBe(0);
  });

  describe("hiddenColumns", () => {
    it("can hide columns", () => {
      const { rerender } = renderWithBrowserRouter(
        <MachineListTable
          callId="123456"
          currentPage={1}
          groups={groups}
          hiddenColumns={[]}
          machineCount={10}
          machines={machines}
          pageSize={20}
          setCurrentPage={jest.fn()}
          setSortDirection={jest.fn()}
          setSortKey={jest.fn()}
          sortDirection="none"
          sortKey={null}
        />,
        { state }
      );
      expect(
        screen.getByRole("columnheader", { name: /power/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /zone/i })
      ).toBeInTheDocument();

      rerender(
        <MachineListTable
          callId="123456"
          currentPage={1}
          groups={groups}
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
      );

      expect(
        screen.queryByRole("columnheader", { name: /power/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("columnheader", { name: /zone/i })
      ).not.toBeInTheDocument();
    });

    it("still displays fqdn if showActions is true", () => {
      renderWithBrowserRouter(
        <MachineListTable
          callId="123456"
          currentPage={1}
          groups={groups}
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
        />,
        { state }
      );

      expect(
        screen.getByRole("columnheader", { name: /FQDN/i })
      ).toBeInTheDocument();
    });

    it("hides fqdn if if showActions is false", () => {
      renderWithBrowserRouter(
        <MachineListTable
          callId="123456"
          currentPage={1}
          groups={groups}
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
        />,
        { state }
      );
      expect(
        screen.queryByRole("columnheader", { name: /FQDN/i })
      ).not.toBeInTheDocument();
    });
  });
});
