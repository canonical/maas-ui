import reduxToolkit from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";

import MachineList from "./MachineList";
import { DEFAULTS } from "./MachineListTable/constants";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  FetchNodeStatus,
  NodeStatus,
  NodeStatusCode,
  NodeType,
  TestStatusStatus,
} from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineFilterGroup as machineFilterGroupFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  osInfo as osInfoFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  vaultEnabledState as vaultEnabledStateFactory,
  controllerState as controllerStateFactory,
  controller as controllerFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter, fireEvent } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("MachineList", () => {
  let state: RootState;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    const machines = [
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
        status: NodeStatus.FAILED_TESTING,
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
        machineActions: {
          data: [],
          errors: null,
          loaded: false,
          loading: false,
        },
        vaultEnabled: vaultEnabledStateFactory({ data: false, loaded: true }),
        osInfo: {
          data: osInfoFactory({
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          }),
          errors: null,
          loaded: true,
          loading: false,
        },
      }),
      controller: controllerStateFactory({
        loaded: true,
        items: [controllerFactory({ vault_configured: false })],
      }),
      machine: machineStateFactory({
        items: machines,
        lists: {
          "123456": machineStateListFactory({
            loaded: true,
            groups: [
              machineStateListGroupFactory({
                items: [machines[0].system_id, machines[2].system_id],
                name: "Deployed",
                value: FetchNodeStatus.DEPLOYED,
              }),
              machineStateListGroupFactory({
                items: [machines[1].system_id],
                name: "Releasing",
                value: FetchNodeStatus.RELEASING,
              }),
              machineStateListGroupFactory({
                items: [machines[2].system_id],
                name: "Failed testing",
                value: FetchNodeStatus.FAILED_TESTING,
              }),
            ],
          }),
        },
        filters: [machineFilterGroupFactory()],
        filtersLoaded: true,
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("can display an error", () => {
    state.machine.errors = "Uh oh!";
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { route: "/machines", state }
    );
    expect(screen.getByText("Uh oh!")).toBeInTheDocument();
  });

  it("can display and close an error from machine list", () => {
    state.machine.errors = null;
    state.machine.lists["123456"].errors = { tag: "No such constraint." };
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { route: "/machines", state }
    );
    expect(screen.getByText("tag: No such constraint.")).toBeInTheDocument();

    // Using fireEvent instead of userEvent here,
    // since using the latter seems to break every other test in this file

    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.click(screen.getByRole("button", { name: "Close notification" }));
    expect(
      screen.queryByText("tag: No such contraint.")
    ).not.toBeInTheDocument();
  });

  it("can display a list of errors", () => {
    state.machine.errors = ["Uh oh!", "It broke"];
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { route: "/machines", state }
    );
    expect(screen.getByText("Uh oh! It broke")).toBeInTheDocument();
  });

  it("can display a collection of errors", () => {
    state.machine.errors = { machine: "Uh oh!", network: "It broke" };
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { route: "/machines", state }
    );
    expect(
      screen.getByText("machine: Uh oh! network: It broke")
    ).toBeInTheDocument();
  });

  it("dispatches action to clean up machine state when dismissing errors", () => {
    state.machine.errors = "Everything is broken.";
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { route: "/machines", store }
    );

    // Using fireEvent instead of userEvent here,
    // since using the latter seems to break every other test in this file

    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.click(screen.getByRole("button", { name: "Close notification" }));

    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
  });

  it("displays a message if there are no search results", async () => {
    state.machine.lists = {
      "123456": machineStateListFactory({
        count: 0,
        groups: [],
      }),
    };
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter="no matches here mate"
        setHiddenGroups={jest.fn()}
      />,
      { route: "/machines", state }
    );
    expect(
      screen.getByText("No machines match the search criteria.")
    ).toBeInTheDocument();
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { route: "/machines", store }
    );

    unmount();

    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({
      type: "machine/setSelected",
      payload: null,
    });
  });

  it("can search", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter="free text workload-service:prod"
        setHiddenGroups={jest.fn()}
      />,
      { store }
    );
    const filter = {
      free_text: ["free text"],
      workloads: ["service:prod"],
    };
    const expected = machineActions.fetch("123456", {
      filter,
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches[fetches.length - 1].payload.params.filter).toStrictEqual(
      filter
    );
  });

  it("can change pages", async () => {
    jest
      .spyOn(reduxToolkit, "nanoid")
      .mockReturnValueOnce("mocked-nanoid-1")
      .mockReturnValueOnce("mocked-nanoid-2");
    // Create two pages of machines.
    state.machine.items = Array.from(Array(DEFAULTS.pageSize * 2)).map(() =>
      machineFactory()
    );
    state.machine.lists = {
      "mocked-nanoid-1": machineStateListFactory({
        count: state.machine.items.length,
        groups: [
          machineStateListGroupFactory({
            // Insert the ids of all machines in the list's group.
            items: state.machine.items.map(({ system_id }) => system_id),
          }),
        ],
      }),
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { route: "/machines", store }
    );
    // Using fireEvent instead of userEvent here,
    // since using the latter seems to break every other test in this file
    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    const expected = machineActions.fetch("123456", {
      page_number: 2,
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches).toHaveLength(2);
    expect(fetches[fetches.length - 1].payload.params.page_number).toBe(2);
  });

  it("shows a warning notification if not all controllers are configured with Vault", async () => {
    const controllers = [
      controllerFactory({
        system_id: "abc123",
        vault_configured: true,
        node_type: NodeType.REGION_CONTROLLER,
      }),
      controllerFactory({
        system_id: "def456",
        vault_configured: false,
        node_type: NodeType.REGION_AND_RACK_CONTROLLER,
      }),
    ];
    state.controller.items = controllers;

    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { state }
    );

    expect(screen.getByTestId("vault-notification")).toHaveTextContent(
      "Configure 1 other controller with Vault to complete integration with Vault."
    );
  });

  it("shows a warning notification if  all controllers are configured with Vault but secrets are not migrated", async () => {
    const controllers = [
      controllerFactory({
        system_id: "abc123",
        vault_configured: true,
        node_type: NodeType.REGION_CONTROLLER,
      }),
      controllerFactory({
        system_id: "def456",
        vault_configured: true,
        node_type: NodeType.REGION_AND_RACK_CONTROLLER,
      }),
    ];
    state.controller.items = controllers;

    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { state }
    );

    expect(screen.getByTestId("vault-notification")).toHaveTextContent(
      "Migrate your secrets to Vault to complete integration with Vault."
    );
  });

  it("doesn't show a warning notification if Vault setup has not been started", async () => {
    const controllers = [
      controllerFactory({
        system_id: "abc123",
        vault_configured: false,
        node_type: NodeType.REGION_CONTROLLER,
      }),
      controllerFactory({
        system_id: "def456",
        vault_configured: false,
        node_type: NodeType.REGION_AND_RACK_CONTROLLER,
      }),
    ];
    state.controller.items = controllers;

    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { state }
    );

    expect(screen.queryByTestId("vault-notification")).not.toBeInTheDocument();
  });

  it("doesn't show a warning notification if Vault is fully configured", async () => {
    const controllers = [
      controllerFactory({
        system_id: "abc123",
        vault_configured: true,
        node_type: NodeType.REGION_CONTROLLER,
      }),
      controllerFactory({
        system_id: "def456",
        vault_configured: true,
        node_type: NodeType.REGION_AND_RACK_CONTROLLER,
      }),
    ];
    state.controller.items = controllers;
    state.general = generalStateFactory({
      vaultEnabled: vaultEnabledStateFactory({
        data: true,
        loaded: true,
      }),
    });

    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { state }
    );

    expect(screen.queryByTestId("vault-notification")).not.toBeInTheDocument();
  });

  it("uses the stored machineListPageSize", () => {
    localStorage.setItem("machineListPageSize", "20");
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { store }
    );
    const expected = machineActions.fetch("123456", {
      page_size: 20,
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches).toHaveLength(1);
    expect(fetches.at(-1).payload.params.page_size).toBe(20);
  });

  it("falls back to default for invalid stored machineListPageSize", () => {
    localStorage.setItem("machineListPageSize", '"invalid_value"');
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList
        grouping={null}
        hiddenColumns={[]}
        hiddenGroups={[]}
        searchFilter=""
        setHiddenGroups={jest.fn()}
      />,
      { store }
    );
    const expected = machineActions.fetch("123456", {
      page_size: DEFAULTS.pageSize,
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches).toHaveLength(1);
    expect(fetches.at(-1).payload.params.page_size).toBe(DEFAULTS.pageSize);
  });
});
