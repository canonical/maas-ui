import reduxToolkit from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { MachineSidePanelViews } from "../constants";

import {
  Label,
  Label as MachineListLabel,
} from "./MachineList/MachineListTable/MachineListTable";
import { DEFAULTS } from "./MachineList/MachineListTable/constants";
import Machines from "./Machines";

import { actions as machineActions } from "app/store/machine";
import { FetchGroupKey } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
  FetchNodeStatus,
} from "app/store/types/node";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  machineFilterGroup as machineFilterGroupFactory,
  testStatus as testStatusFactory,
  osInfo as osInfoFactory,
  rootState as rootStateFactory,
  routerState as routerStateFactory,
  modelRef as modelRefFactory,
  vaultEnabledState as vaultEnabledStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  userEvent as userEventCore,
  within,
  screen,
  render,
  waitFor,
} from "testing/utils";

const mockStore = configureStore<RootState>();
const userEvent = userEventCore.setup({
  advanceTimers: jest.runAllTimers,
});

describe("Machines", () => {
  let state: RootState;
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
  const machineList = machineStateListFactory({
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
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
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
        version: {
          data: "2.8.0",
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
          "78910": machineList,
        },
        filters: [machineFilterGroupFactory()],
        filtersLoaded: true,
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      }),
      router: routerStateFactory(),
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("can set the search from the URL", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <Machines />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue(
      "test search"
    );
  });

  it("changes the URL when the search text changes", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<Machines />, {
      route: "/machines?q=test+search",
      store,
    });
    await userEvent.clear(screen.getByRole("searchbox", { name: "Search" }));
    await userEvent.type(
      screen.getByRole("searchbox", { name: "Search" }),
      "status:new"
    );
    expect(window.location.search).toBe("?status=new");
  });

  it("can hide groups", async () => {
    jest
      .spyOn(reduxToolkit, "nanoid")
      .mockReturnValueOnce("123456")
      .mockReturnValueOnce("78910");
    const store = mockStore(state);
    renderWithBrowserRouter(<Machines />, { route: "/machines", store });
    const expected = machineActions.fetch("123456", {
      group_collapsed: ["failed_testing"],
    });
    const getFetchActions = () =>
      store.getActions().filter((action) => action.type === expected.type);
    const initialFetchActions = getFetchActions();
    await waitFor(() => expect(initialFetchActions).toHaveLength(1));
    // Click the button to toggle the group.
    await userEvent.click(
      within(
        screen.getByRole("row", { name: "Failed testing machines group" })
      ).getByRole("button", { name: Label.HideGroup })
    );
    await waitFor(() => expect(getFetchActions()).toHaveLength(2));
    const finalFetchAction = getFetchActions()[1];
    expect(finalFetchAction.payload.params.group_collapsed).toStrictEqual([
      "failed_testing",
    ]);
  });

  it("can change groups", async () => {
    jest
      .spyOn(reduxToolkit, "nanoid")
      .mockReturnValueOnce("mocked-nanoid-1")
      .mockReturnValueOnce("mocked-nanoid-2");
    // Create two pages of machines.
    state.machine.items = Array.from(Array(DEFAULTS.pageSize * 2)).map(() =>
      machineFactory()
    );
    state.machine.lists = {
      "mocked-nanoid-2": machineStateListFactory({
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
    const expected = machineActions.fetch("123456", {
      group_key: FetchGroupKey.Owner,
    });
    const getFetchActions = () =>
      store.getActions().filter((action) => action.type === expected.type);
    renderWithBrowserRouter(<Machines />, { route: "/machines", store });

    const initialFetchActions = getFetchActions();
    await waitFor(() => expect(initialFetchActions).toHaveLength(1));

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /Group by/i }),
      screen.getByRole("option", { name: "Group by owner" })
    );
    await waitFor(() => expect(getFetchActions()).toHaveLength(2));
    const finalFetchAction = getFetchActions()[1];
    expect(finalFetchAction.payload.params.group_key).toBe(FetchGroupKey.Owner);
  });

  it("can store the group in local storage", async () => {
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(<Machines />, {
      route: "/machines",
      store,
    });
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /Group by/i }),
      screen.getByRole("option", { name: "Group by owner" })
    );
    unmount();
    // Render another machine list, this time it should restore the value
    // set by the select.
    const store2 = mockStore(state);
    renderWithBrowserRouter(<Machines />, {
      route: "/machines",
      store: store2,
    });

    expect(localStorage.getItem("grouping")).toBe('"owner"');
  });

  it("uses the default fallback value for invalid stored grouping values", async () => {
    localStorage.setItem("grouping", '"invalid_value"');
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
    const store = mockStore(state);
    renderWithBrowserRouter(<Machines />, { store });
    expect(screen.getByLabelText(/Group by/)).toHaveValue(DEFAULTS.grouping);
    const expected = machineActions.fetch("123456", {
      group_key: DEFAULTS.grouping,
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches).toHaveLength(1);
    expect(fetches.at(-1).payload.params.group_key).toBe(DEFAULTS.grouping);
  });

  it("can store hidden groups in local storage", async () => {
    jest
      .spyOn(reduxToolkit, "nanoid")
      .mockReturnValueOnce("mocked-nanoid-1")
      .mockReturnValueOnce("mocked-nanoid-2");
    state.machine.lists = {
      "mocked-nanoid-1": machineList,
      "mocked-nanoid-2": machineList,
    };
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(<Machines />, {
      route: "/machines",
      store,
    });
    const expected = machineActions.fetch("123456", {
      group_collapsed: [],
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(
      fetches[fetches.length - 1].payload.params.group_collapsed
    ).toStrictEqual([]);
    // Click the button to toggle the group.
    await userEvent.click(
      within(
        screen.getByRole("row", { name: "Deployed machines group" })
      ).getByRole("button", { name: MachineListLabel.HideGroup })
    );
    // Render another machine list, this time it should restore the
    // hidden group state.
    unmount();
    const store2 = mockStore(state);
    renderWithBrowserRouter(<Machines />, {
      route: "/machines",
      store: store2,
    });
    const expected2 = machineActions.fetch("123456", {
      group_collapsed: ["deployed"],
    });
    const fetches2 = store2
      .getActions()
      .filter((action) => action.type === expected2.type);
    expect(
      fetches2[fetches.length - 1].payload.params.group_collapsed
    ).toStrictEqual(["deployed"]);
  });

  it("displays the action title if an action is selected", () => {
    state.machine.selectedMachines = { items: ["abc123"] };
    renderWithBrowserRouter(<Machines />, {
      state,
      route: "/machines",
      sidePanelContent: { view: MachineSidePanelViews.DEPLOY_MACHINE },
    });

    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "0 machines in 0 pools"
    );
    expect(
      within(screen.getByTestId("section-header-content")).getByRole(
        "heading",
        { level: 3 }
      )
    ).toHaveTextContent("Deploy");
  });
});
