import userEvent from "@testing-library/user-event";
import { describe } from "vitest";

import MachinesTable from "./MachinesTable";

import { DEFAULTS } from "@/app/machines/views/MachinesList/constants";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import {
  FetchNodeStatus,
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "@/app/store/types/node";
import { DeleteZone, EditZone } from "@/app/zones/components";
import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import { usersResolvers } from "@/testing/resolvers/users";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
  within,
  mockSidePanel,
} from "@/testing/utils";

const mockServer = setupMockServer(
  usersResolvers.listUsers.handler(),
  poolsResolvers.listPools.handler(),
  zoneResolvers.listZones.handler()
);
const { mockOpen } = await mockSidePanel();

describe("MachinesTable", () => {
  let state: RootState;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(query, "generateCallId").mockReturnValue("123456");
    const machines = [
      factory.machine({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 4,
        cpu_test_status: factory.testStatus({
          status: TestStatusStatus.RUNNING,
        }),
        distro_series: "bionic",
        domain: factory.modelRef({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "koala.example",
        hostname: "koala",
        ip_addresses: [],
        memory: 8,
        memory_test_status: factory.testStatus({
          status: TestStatusStatus.PASSED,
        }),
        network_test_status: factory.testStatus({
          status: TestStatusStatus.PASSED,
        }),
        osystem: "ubuntu",
        owner: "admin",
        physical_disk_count: 1,
        pool: factory.modelRef(),
        pxe_mac: "00:11:22:33:44:55",
        spaces: [],
        status: NodeStatus.DEPLOYED,
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 8,
        storage_test_status: factory.testStatus({
          status: TestStatusStatus.PASSED,
        }),
        testing_status: TestStatusStatus.PASSED,
        system_id: "abc123",
        zone: factory.modelRef(),
      }),
      factory.machine({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 2,
        cpu_test_status: factory.testStatus({
          status: TestStatusStatus.FAILED,
        }),
        distro_series: "xenial",
        domain: factory.modelRef({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "other.example",
        hostname: "other",
        ip_addresses: [],
        memory: 6,
        memory_test_status: factory.testStatus({
          status: TestStatusStatus.FAILED,
        }),
        network_test_status: factory.testStatus({
          status: TestStatusStatus.FAILED,
        }),
        osystem: "ubuntu",
        owner: "user",
        physical_disk_count: 2,
        pool: factory.modelRef(),
        pxe_mac: "66:77:88:99:00:11",
        spaces: [],
        status: NodeStatus.RELEASING,
        status_code: NodeStatusCode.RELEASING,
        status_message: "",
        storage: 16,
        storage_test_status: factory.testStatus({
          status: TestStatusStatus.FAILED,
        }),
        testing_status: TestStatusStatus.FAILED,
        system_id: "def456",
        zone: factory.modelRef(),
      }),
      factory.machine({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 2,
        cpu_test_status: factory.testStatus({
          status: TestStatusStatus.FAILED,
        }),
        distro_series: "xenial",
        domain: factory.modelRef({
          name: "example",
        }),
        extra_macs: [],
        fqdn: "other.example",
        hostname: "other",
        ip_addresses: [],
        memory: 6,
        memory_test_status: factory.testStatus({
          status: TestStatusStatus.FAILED,
        }),
        network_test_status: factory.testStatus({
          status: TestStatusStatus.FAILED,
        }),
        osystem: "ubuntu",
        owner: "user",
        physical_disk_count: 2,
        pool: factory.modelRef(),
        pxe_mac: "66:77:88:99:00:11",
        spaces: [],
        status: NodeStatus.FAILED_TESTING,
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 16,
        storage_test_status: factory.testStatus({
          status: TestStatusStatus.FAILED,
        }),
        testing_status: TestStatusStatus.FAILED,
        system_id: "ghi789",
        zone: factory.modelRef(),
      }),
    ];
    state = factory.rootState({
      general: factory.generalState({
        machineActions: {
          data: [],
          errors: null,
          loaded: false,
          loading: false,
        },
        vaultEnabled: factory.vaultEnabledState({ data: false, loaded: true }),
        osInfo: {
          data: factory.osInfo({
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          }),
          errors: null,
          loaded: true,
          loading: false,
        },
      }),
      controller: factory.controllerState({
        loaded: true,
        items: [factory.controller({ vault_configured: false })],
      }),
      machine: factory.machineState({
        items: machines,
        lists: {
          "123456": factory.machineStateList({
            loaded: true,
            groups: [
              factory.machineStateListGroup({
                items: [machines[0].system_id],
                name: "Deployed",
                value: FetchNodeStatus.DEPLOYED,
              }),
              factory.machineStateListGroup({
                items: [machines[1].system_id],
                name: "Releasing",
                value: FetchNodeStatus.RELEASING,
              }),
              factory.machineStateListGroup({
                items: [machines[2].system_id],
                name: "Failed testing",
                value: FetchNodeStatus.FAILED_TESTING,
              }),
            ],
          }),
        },
        filters: [factory.machineFilterGroup()],
        filtersLoaded: true,
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("display", () => {
    it("displays a loading component if machines are loading", async () => {
      state.machine.lists["123456"].loading = true;
      renderWithProviders(
        <MachinesTable grouping={DEFAULTS.grouping} hiddenColumns={[]} />,
        { state }
      );

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    describe("displays a message when rendering an empty list", () => {
      it("displays a message when there are no machines", async () => {
        state.machine.lists = {};
        renderWithProviders(
          <MachinesTable grouping={DEFAULTS.grouping} hiddenColumns={[]} />,
          { state }
        );

        await waitFor(() => {
          expect(screen.getByText("No machines found.")).toBeInTheDocument();
        });
      });

      it("displays a message when there are no search matches", async () => {
        state.machine.lists = {};
        renderWithProviders(
          <MachinesTable
            grouping={DEFAULTS.grouping}
            hiddenColumns={[]}
            searchFilter={{ free_text: "free text" }}
          />,
          { state }
        );

        await waitFor(() => {
          expect(
            screen.getByText("No machines match the search criteria.")
          ).toBeInTheDocument();
        });
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(
        <MachinesTable grouping={DEFAULTS.grouping} hiddenColumns={[]} />,
        { state }
      );

      const headerRow = screen.getAllByRole("rowgroup")[0];

      [
        "FQDN",
        "Power",
        "Status",
        "Owner",
        "Pool",
        "Zone",
        "Fabric",
        "Cores",
        "RAM",
        "Disk",
        "Storage",
      ].forEach((column) => {
        expect(
          within(headerRow).getByText(new RegExp(`^${column}`, "i"))
        ).toBeInTheDocument();
      });
    });

    it("can show a machine filter link", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              name: "default",
              machines_count: 5,
              devices_count: 2,
              controllers_count: 1,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<MachinesTable />);

      await waitFor(() => {
        expect(
          within(
            screen.getByRole("row", {
              name: new RegExp(`^default`, "i"),
            })
          ).getByRole("link", { name: "5" })
        ).toHaveAttribute("href", "/machines?zone=default");
      });
    });

    it("can show a device filter link", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              name: "default",
              machines_count: 5,
              devices_count: 2,
              controllers_count: 1,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<MachinesTable />);

      await waitFor(() => {
        expect(
          within(
            screen.getByRole("row", {
              name: new RegExp(`^default`, "i"),
            })
          ).getByRole("link", { name: "2" })
        ).toHaveAttribute("href", "/devices?zone=default");
      });
    });

    it("can show a controller filter link", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              name: "default",
              machines_count: 5,
              devices_count: 2,
              controllers_count: 1,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<MachinesTable />);

      await waitFor(() => {
        expect(
          within(
            screen.getByRole("row", {
              name: new RegExp(`^default`, "i"),
            })
          ).getByRole("link", { name: "1" })
        ).toHaveAttribute("href", "/controllers");
      });
    });
  });

  // TODO: backend-provided permissions is only available for pools,
  //  and will be discussed as to whether they should be added everywhere.
  //  Enable these tests if they are added to zones
  describe("permissions", () => {
    it.todo("enables the action buttons with correct permissions");

    it.todo("disables the action buttons without permissions");

    it("disables the delete button for default zones", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              id: 1,
              name: "default",
              description: "default",
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<MachinesTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeAriaDisabled();
      });
    });
  });

  describe("actions", () => {
    it("opens edit zones side panel form", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [factory.zone({ id: 1 })],
          total: 1,
        })
      );

      renderWithProviders(<MachinesTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Edit" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Edit" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: EditZone,
        title: "Edit AZ",
        props: { id: 1 },
      });
    });

    it("opens delete zone side panel form", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              id: 2,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<MachinesTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: DeleteZone,
        title: "Delete AZ",
        props: { id: 2 },
      });
    });
  });
});
