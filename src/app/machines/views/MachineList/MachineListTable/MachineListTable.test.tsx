import { MachineListTable, Label, PAGE_SIZES } from "./MachineListTable";
import type { MachineListTableProps } from "./types";

import { SortDirection } from "@/app/base/types";
import { machineActions } from "@/app/store/machine";
import type { Machine, MachineStateListGroup } from "@/app/store/machine/types";
import { FetchGroupKey } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import { NodeStatus, NodeStatusCode } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import { mockUsers, usersResolvers } from "@/testing/resolvers/users";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  fireEvent,
  userEvent,
  screen,
  within,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  usersResolvers.listUsers.handler(),
  usersResolvers.listUsersStatistics.handler(),
  poolsResolvers.listPools.handler(),
  zoneResolvers.listZones.handler(),
  zoneResolvers.listZonesWithStatistics.handler()
);

const callId = "mocked-nanoid";

const getTableHeader = () => screen.getAllByRole("rowgroup")[0];
const getTableBody = () => screen.getAllByRole("rowgroup")[1];
const getBodyRows = () => within(getTableBody()).getAllByRole("row");
const getMachineRow = (hostname: string) =>
  getBodyRows().find((row) => row.textContent?.includes(hostname));

describe("MachineListTable", () => {
  let state: RootState;
  let machines: Machine[];
  let groups: MachineStateListGroup[];
  let defaultProps: MachineListTableProps;

  const renderTable = (props: Partial<MachineListTableProps> = {}) =>
    renderWithProviders(<MachineListTable {...defaultProps} {...props} />, {
      state,
    });

  beforeEach(() => {
    machines = [
      factory.machine({
        domain: factory.modelRef({ name: "example" }),
        fqdn: "koala.example",
        hostname: "koala",
        owner: mockUsers.items[0].username,
        pxe_mac: "00:11:22:33:44:55",
        status: NodeStatus.DEPLOYED,
        status_code: NodeStatusCode.DEPLOYED,
        system_id: "abc123",
      }),
      factory.machine({
        domain: factory.modelRef({ name: "example" }),
        fqdn: "wombat.example",
        hostname: "wombat",
        owner: "user",
        pxe_mac: "66:77:88:99:00:11",
        status: NodeStatus.RELEASING,
        status_code: NodeStatusCode.RELEASING,
        system_id: "def456",
      }),
      factory.machine({
        domain: factory.modelRef({ name: "example" }),
        fqdn: "quokka.example",
        hostname: "quokka",
        owner: "user",
        pxe_mac: "aa:bb:cc:dd:ee:ff",
        status: NodeStatus.DEPLOYED,
        status_code: NodeStatusCode.DEPLOYED,
        system_id: "ghi789",
      }),
    ];
    groups = [
      factory.machineStateListGroup({
        count: 2,
        items: [machines[0].system_id, machines[2].system_id],
        name: "Deployed",
        value: "deployed",
      }),
      factory.machineStateListGroup({
        count: 1,
        items: [machines[1].system_id],
        name: "Releasing",
        value: "releasing",
      }),
    ];
    state = factory.rootState({
      general: factory.generalState({
        machineActions: factory.machineActionsState({ data: [] }),
        osInfo: factory.osInfoState({
          data: factory.osInfo({
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          }),
          loaded: true,
        }),
      }),
      machine: factory.machineState({
        items: machines,
        lists: {
          [callId]: factory.machineStateList({ loading: false, groups }),
        },
      }),
    });
    defaultProps = {
      callId,
      currentPage: 1,
      filter: "",
      grouping: null,
      groups,
      hiddenGroups: [],
      machineCount: 3,
      machines,
      pageSize: 50,
      setCurrentPage: vi.fn(),
      setHiddenGroups: vi.fn(),
      setPageSize: vi.fn(),
      setSortDirection: vi.fn(),
      setSortKey: vi.fn(),
      sortDirection: SortDirection.NONE,
      sortKey: null,
      totalPages: 1,
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("display", () => {
    it("displays skeleton rows when loading", () => {
      renderTable({ machinesLoading: true });

      const table = screen.getByRole("treegrid", { name: Label.Loading });
      expect(table).toHaveAttribute("aria-busy", "true");
      expect(within(table).getAllByText("xxxxxxxxx.xxxx")).toHaveLength(5);
    });

    it("labels the table with the current grouping", () => {
      renderTable({ grouping: FetchGroupKey.Status });

      expect(
        screen.getByRole("treegrid", {
          name: `${Label.Machines} - Group by status`,
        })
      ).toBeInTheDocument();
    });

    it("displays a row for each machine", () => {
      renderTable();

      expect(getBodyRows()).toHaveLength(machines.length);
      machines.forEach(({ hostname }) => {
        expect(
          within(getTableBody()).getByRole("link", {
            name: new RegExp(hostname),
          })
        ).toBeInTheDocument();
      });
    });

    it("displays a message if there are no search results", () => {
      renderTable({
        filter: "this does not match anything",
        groups: [],
        machineCount: 0,
        machines: [],
      });

      expect(screen.getByText(Label.NoResults)).toBeInTheDocument();
    });

    it("displays a message if there are no machines", () => {
      renderTable({ groups: [], machineCount: 0, machines: [] });

      expect(screen.getByText(Label.EmptyList)).toBeInTheDocument();
    });
  });

  describe("grouping", () => {
    it("displays a row for each group", () => {
      renderTable({ grouping: FetchGroupKey.Status });

      expect(
        screen.getAllByRole("row", { name: /machines group/i })
      ).toHaveLength(2);
      expect(
        screen.getByRole("row", { name: /Deployed machines group/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", { name: /Releasing machines group/i })
      ).toBeInTheDocument();
    });

    it("displays the machines in server order beneath their group", () => {
      renderTable({ grouping: FetchGroupKey.Status });

      const rowText = getBodyRows().map((row) => row.textContent);
      expect(rowText[0]).toContain("Deployed");
      expect(rowText[1]).toContain("koala");
      expect(rowText[2]).toContain("quokka");
      expect(rowText[3]).toContain("Releasing");
      expect(rowText[4]).toContain("wombat");
    });

    it("displays group rows as a single cell", () => {
      renderTable({ grouping: FetchGroupKey.Status });

      const groupRow = screen.getByRole("row", {
        name: /Deployed machines group/i,
      });
      expect(within(groupRow).getAllByRole("gridcell")).toHaveLength(1);
    });

    it("displays the machine count in group rows", () => {
      renderTable({ grouping: FetchGroupKey.Status });

      expect(
        within(
          screen.getByRole("row", { name: /Deployed machines group/i })
        ).getByText("2 machines")
      ).toBeInTheDocument();
    });

    it("does not display machines in collapsed groups", () => {
      groups[1].collapsed = true;
      renderTable({ grouping: FetchGroupKey.Status });

      expect(
        screen.getByRole("row", { name: /Releasing machines group/i })
      ).toBeInTheDocument();
      expect(
        within(getTableBody()).queryByRole("link", { name: /wombat/ })
      ).not.toBeInTheDocument();
    });

    it("can collapse a group", async () => {
      const setHiddenGroups = vi.fn();
      renderTable({ grouping: FetchGroupKey.Status, setHiddenGroups });

      await userEvent.click(
        within(
          screen.getByRole("row", { name: /Deployed machines group/i })
        ).getByRole("button", { name: "Hide" })
      );

      expect(setHiddenGroups).toHaveBeenCalledWith(["deployed"]);
    });

    it("does not display group rows if the table is ungrouped", () => {
      renderTable({ grouping: null });

      expect(
        screen.queryByRole("row", { name: /machines group/i })
      ).not.toBeInTheDocument();
    });

    it("reports a row count that includes group rows", () => {
      renderTable({ grouping: FetchGroupKey.Status });

      const table = screen.getByRole("treegrid");
      expect(table).toHaveAttribute(
        "aria-rowcount",
        String(within(table).getAllByRole("row").length)
      );
    });
  });

  describe("columns", () => {
    it("can display the PXE MAC instead of the FQDN", async () => {
      renderTable();

      await userEvent.click(
        within(getTableHeader()).getByRole("button", { name: "MAC" })
      );

      expect(within(getTableBody()).getAllByRole("link")[0]).toHaveTextContent(
        machines[0].pxe_mac!
      );
    });

    it("can display the owner's full name instead of their username", async () => {
      renderTable();

      const getFirstOwnerCell = () =>
        within(getBodyRows()[0]).getByRole("gridcell", { name: "Owner" });
      expect(
        within(getFirstOwnerCell()).getByText(mockUsers.items[0].username)
      ).toBeInTheDocument();

      await userEvent.click(
        within(screen.getByRole("columnheader", { name: "Owner" })).getByRole(
          "button",
          { name: /Name/ }
        )
      );

      await waitFor(() => {
        expect(
          within(getFirstOwnerCell()).getByText(
            new RegExp(mockUsers.items[0].last_name!)
          )
        ).toBeInTheDocument();
      });
    });

    it("can render all columns", () => {
      renderTable({ hiddenColumns: [] });

      expect(getTableHeader().querySelectorAll("th")).toHaveLength(11);
      expect(
        screen.getByRole("columnheader", { name: /power/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /zone/i })
      ).toBeInTheDocument();
    });

    it("can hide columns", () => {
      renderTable({ hiddenColumns: ["power", "zone"] });

      expect(
        screen.queryByRole("columnheader", { name: /power/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("columnheader", { name: /zone/i })
      ).not.toBeInTheDocument();
      expect(
        within(getBodyRows()[0]).queryByRole("gridcell", { name: "Power" })
      ).not.toBeInTheDocument();
    });

    it("still displays the FQDN column if showActions is true", () => {
      renderTable({ hiddenColumns: ["fqdn"], showActions: true });

      expect(
        screen.getByRole("columnheader", { name: /FQDN/i })
      ).toBeInTheDocument();
    });

    it("hides the FQDN column if showActions is false", () => {
      renderTable({ hiddenColumns: ["fqdn"], showActions: false });

      expect(
        screen.queryByRole("columnheader", { name: /FQDN/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("updates the sort on header click", async () => {
      const setSortDirection = vi.fn();
      const setSortKey = vi.fn();
      renderTable({ setSortDirection, setSortKey });

      await userEvent.click(
        within(getTableHeader()).getByRole("button", { name: /cores/i })
      );

      expect(setSortKey).toHaveBeenCalledWith(FetchGroupKey.CpuCount);
      expect(setSortDirection).toHaveBeenCalledWith(SortDirection.DESCENDING);
    });

    it("clears the sort when the same header is clicked and is ascending", async () => {
      const setSortDirection = vi.fn();
      const setSortKey = vi.fn();
      renderTable({
        setSortDirection,
        setSortKey,
        sortDirection: SortDirection.ASCENDING,
        sortKey: FetchGroupKey.CpuCount,
      });

      await userEvent.click(
        within(getTableHeader()).getByRole("button", { name: /cores/i })
      );

      expect(setSortKey).toHaveBeenCalledWith(null);
      expect(setSortDirection).toHaveBeenCalledWith(SortDirection.NONE);
    });

    it("updates the sort when the same header is clicked and is descending", async () => {
      const setSortDirection = vi.fn();
      const setSortKey = vi.fn();
      renderTable({
        setSortDirection,
        setSortKey,
        sortDirection: SortDirection.DESCENDING,
        sortKey: FetchGroupKey.CpuCount,
      });

      await userEvent.click(
        within(getTableHeader()).getByRole("button", { name: /cores/i })
      );

      expect(setSortKey).not.toHaveBeenCalled();
      expect(setSortDirection).toHaveBeenCalledWith(SortDirection.ASCENDING);
    });

    it("updates the sort when the same header is clicked and direction is not set", async () => {
      const setSortDirection = vi.fn();
      const setSortKey = vi.fn();
      renderTable({
        setSortDirection,
        setSortKey,
        sortDirection: SortDirection.NONE,
        sortKey: FetchGroupKey.CpuCount,
      });

      await userEvent.click(
        within(getTableHeader()).getByRole("button", { name: /cores/i })
      );

      expect(setSortKey).not.toHaveBeenCalled();
      expect(setSortDirection).toHaveBeenCalledWith(SortDirection.ASCENDING);
    });

    it("updates the sort when a different header is clicked", async () => {
      const setSortDirection = vi.fn();
      const setSortKey = vi.fn();
      renderTable({
        setSortDirection,
        setSortKey,
        sortDirection: SortDirection.DESCENDING,
        sortKey: FetchGroupKey.CpuCount,
      });

      await userEvent.click(
        within(getTableHeader()).getByRole("button", { name: /power/i })
      );

      expect(setSortKey).toHaveBeenCalledWith(FetchGroupKey.PowerState);
      expect(setSortDirection).toHaveBeenCalledWith(SortDirection.DESCENDING);
    });
  });

  describe("selection", () => {
    it("displays a checkbox for all machines and for each machine", () => {
      renderTable({ showActions: true });

      expect(
        screen.getByRole("checkbox", { name: "All machines" })
      ).toBeInTheDocument();
      expect(screen.getAllByRole("checkbox")).toHaveLength(machines.length + 1);
    });

    it("displays a checkbox for each group", () => {
      renderTable({ grouping: FetchGroupKey.Status, showActions: true });

      expect(
        screen.getByRole("checkbox", { name: /Deployed/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: /Releasing/ })
      ).toBeInTheDocument();
    });

    it("does not display checkboxes if showActions is false", () => {
      renderTable({ grouping: FetchGroupKey.Status, showActions: false });

      expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    });

    it("can select a machine", async () => {
      const { store } = renderTable({ showActions: true });

      await userEvent.click(screen.getByRole("checkbox", { name: /koala/ }));

      const expected = machineActions.setSelected({ items: ["abc123"] });
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });

    it("marks selected machines as selected rows", () => {
      state.machine.selected = { items: [machines[0].system_id] };
      renderTable();

      expect(getMachineRow("koala")).toHaveAttribute("aria-selected", "true");
      expect(getMachineRow("quokka")).toHaveAttribute("aria-selected", "false");
      expect(getMachineRow("wombat")).toHaveAttribute("aria-selected", "false");
    });

    it.each([
      {
        // The group checkbox selects an expanded group's machines.
        description: "all of its machines are selected",
        selected: {
          items: ["abc123", "ghi789"],
          grouping: FetchGroupKey.Status,
        },
      },
      {
        description: "it is selected by value",
        selected: { groups: ["deployed"], grouping: FetchGroupKey.Status },
      },
    ])("marks a group's rows as selected when $description", ({ selected }) => {
      state.machine.selected = selected;
      renderTable({ grouping: FetchGroupKey.Status });

      expect(
        screen.getByRole("row", { name: /Deployed machines group/i })
      ).toHaveAttribute("aria-selected", "true");
      expect(
        screen.getByRole("row", { name: /Releasing machines group/i })
      ).toHaveAttribute("aria-selected", "false");
      expect(getMachineRow("koala")).toHaveAttribute("aria-selected", "true");
      expect(getMachineRow("quokka")).toHaveAttribute("aria-selected", "true");
      expect(getMachineRow("wombat")).toHaveAttribute("aria-selected", "false");
    });
  });

  describe("pagination", () => {
    it("displays the number of machines on the current page", () => {
      renderTable({ machineCount: 120, pageSize: 50, totalPages: 3 });

      expect(
        screen.getByText(`Showing ${machines.length} out of 120 machines`)
      ).toBeInTheDocument();
    });

    it("uses the server page count, which excludes collapsed groups", () => {
      renderTable({ machineCount: 150, pageSize: 50, totalPages: 1 });

      expect(
        screen.getByRole("button", { name: "Next page" })
      ).toBeAriaDisabled();
    });

    it("does not display pagination if there are no machines", () => {
      renderTable({ groups: [], machineCount: 0, machines: [] });

      expect(
        screen.queryByRole("button", { name: "Next page" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("combobox", { name: "Items per page" })
      ).not.toBeInTheDocument();
    });

    it("can change the page", async () => {
      const setCurrentPage = vi.fn();
      renderTable({
        machineCount: 120,
        pageSize: 50,
        setCurrentPage,
        totalPages: 3,
      });

      await userEvent.click(screen.getByRole("button", { name: "Next page" }));

      expect(setCurrentPage).toHaveBeenCalledWith(2);
    });

    it("navigates once after a multi-digit page number is typed", async () => {
      const setCurrentPage = vi.fn();
      renderTable({ machineCount: 1500, setCurrentPage, totalPages: 30 });

      const pageInput = screen.getByRole("spinbutton", { name: "page number" });
      // Simulate selecting the current page and typing "2" then "5".
      fireEvent.change(pageInput, { target: { value: "2" } });
      fireEvent.change(pageInput, { target: { value: "25" } });

      await waitFor(() => {
        expect(setCurrentPage).toHaveBeenCalledWith(25);
      });
      expect(setCurrentPage).toHaveBeenCalledTimes(1);
    });

    it("offers the supported page sizes", () => {
      renderTable();

      const options = within(
        screen.getByRole("combobox", { name: "Items per page" })
      ).getAllByRole("option");
      expect(options.map((option) => option.textContent)).toEqual(
        PAGE_SIZES.map((size) => `${size}/page`)
      );
    });

    it("returns to the first page when the page size changes", async () => {
      const setCurrentPage = vi.fn();
      const setPageSize = vi.fn();
      renderTable({
        currentPage: 2,
        machineCount: 120,
        setCurrentPage,
        setPageSize,
      });

      await userEvent.selectOptions(
        screen.getByRole("combobox", { name: "Items per page" }),
        "100/page"
      );

      expect(setCurrentPage).toHaveBeenCalledWith(1);
      expect(setPageSize).toHaveBeenCalledWith(100);
    });
  });
});
