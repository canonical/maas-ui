import reduxToolkit from "@reduxjs/toolkit";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineList from "./MachineList";
import { Label as AllCheckboxLabel } from "./MachineListTable/AllCheckbox/AllCheckbox";
import { Label } from "./MachineListTable/MachineListTable";
import { DEFAULTS } from "./MachineListTable/constants";

import { Label as MachinesFilterLabels } from "app/machines/views/MachineList/MachineListControls/MachinesFilterAccordion/MachinesFilterAccordion";
import { actions as machineActions } from "app/store/machine";
import { FetchGroupKey, FilterGroupKey } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
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
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

jest.useFakeTimers();

describe("MachineList", () => {
  let state: RootState;

  beforeEach(() => {
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
        permissions: ["edit", "delete"],
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
        permissions: ["edit", "delete"],
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
        permissions: ["edit", "delete"],
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
              }),
              machineStateListGroupFactory({
                items: [machines[1].system_id],
                name: "Releasing",
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
  });

  it("can hide groups", async () => {
    jest
      .spyOn(reduxToolkit, "nanoid")
      .mockReturnValueOnce("123456")
      .mockReturnValueOnce("78910");
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
      { store }
    );
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    // Click the button to toggle the group.
    await user.click(
      within(
        screen.getByRole("row", { name: "Deployed machines group" })
      ).getByRole("button", { name: Label.HideGroup })
    );
    const expected = machineActions.fetch("123456", {
      group_collapsed: ["Deployed"],
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches).toHaveLength(2);
    expect(
      fetches[fetches.length - 1].payload.params.group_collapsed
    ).toStrictEqual(["Deployed"]);
  });

  it("uses the default fallback value for invalid stored grouping values", () => {
    localStorage.setItem("grouping", '"invalid_value"');
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
      { store }
    );
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

  it("can change groups", () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Change grouping to owner
    wrapper
      .find('Select[name="machine-groupings"]')
      .find("select")
      .simulate("change", { target: { value: FetchGroupKey.Owner } });
    const expected = machineActions.fetch("123456", {
      group_key: FetchGroupKey.Owner,
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches).toHaveLength(2);
    expect(fetches[fetches.length - 1].payload.params.group_key).toBe(
      FetchGroupKey.Owner
    );
  });

  it("can store the group in local storage", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find('Select[name="machine-groupings"]')
        .find("select")
        .prop("defaultValue")
    ).toBe("status");
    wrapper
      .find('Select[name="machine-groupings"] select')
      .simulate("change", { target: { value: "owner" } });
    // Render another machine list, this time it should restore the value
    // set by the select.
    const store2 = mockStore(state);
    const wrapper2 = mount(
      <Provider store={store2}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper2
        .find('Select[name="machine-groupings"] select')
        .prop("defaultValue")
    ).toBe("owner");
  });

  it("can store hidden groups in local storage", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
      { store }
    );
    const expected = machineActions.fetch("123456", {
      group_collapsed: [],
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(
      fetches[fetches.length - 1].payload.params.group_collapsed
    ).toStrictEqual([]);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    // Click the button to toggle the group.
    await user.click(
      within(
        screen.getByRole("row", { name: "Deployed machines group" })
      ).getByRole("button", { name: Label.HideGroup })
    );
    // Render another machine list, this time it should restore the
    // hidden group state.
    const store2 = mockStore(state);
    renderWithBrowserRouter(
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
      { store: store2 }
    );
    const expected2 = machineActions.fetch("123456", {
      group_collapsed: ["Deployed"],
    });
    const fetches2 = store2
      .getActions()
      .filter((action) => action.type === expected2.type);
    expect(
      fetches2[fetches.length - 1].payload.params.group_collapsed
    ).toStrictEqual(["Deployed"]);
  });

  it("can display an error", () => {
    state.machine.errors = "Uh oh!";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    // eslint-disable-next-line testing-library/no-node-access
    expect(wrapper.find("Notification").props().children).toBe("Uh oh!");
  });

  it("can display and close an error from machine list", () => {
    state.machine.errors = null;
    state.machine.lists["123456"].errors = { tag: "No such constraint." };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    // eslint-disable-next-line testing-library/no-node-access
    expect(wrapper.find("Notification").props().children).toBe(
      "tag: No such constraint."
    );
    wrapper.find("Notification button").simulate("click");
    expect(wrapper.find("Notification").exists()).toBe(false);
  });

  it("can display a list of errors", () => {
    state.machine.errors = ["Uh oh!", "It broke"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    // eslint-disable-next-line testing-library/no-node-access
    expect(wrapper.find("Notification").props().children).toBe(
      "Uh oh! It broke"
    );
  });

  it("can display a collection of errors", () => {
    state.machine.errors = { machine: "Uh oh!", network: "It broke" };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    // eslint-disable-next-line testing-library/no-node-access
    expect(wrapper.find("Notification").props().children).toBe(
      "machine: Uh oh! network: It broke"
    );
  });

  it("dispatches action to clean up machine state when dismissing errors", () => {
    state.machine.errors = "Everything is broken.";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Notification button").simulate("click");
    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
  });

  it("displays a message if there are no search results", () => {
    state.machine.lists = {
      "123456": machineStateListFactory({
        count: 0,
        groups: [],
      }),
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList
              searchFilter="this does not match anything"
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("table caption").text()).toBe(
      "No machines match the search criteria."
    );
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/setSelectedMachines")
    ).toStrictEqual({
      type: "machine/setSelectedMachines",
      payload: null,
    });
  });

  it("resets the selected machines on grouping change", async () => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
      { store }
    );
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });
    await user.click(
      screen.getByRole("checkbox", { name: AllCheckboxLabel.AllMachines })
    );
    await user.click(
      within(
        screen.getByRole("row", { name: "Deployed machines group" })
      ).getByRole("button", { name: Label.HideGroup })
    );
    await user.selectOptions(
      screen.getByLabelText(/Group by/),
      "Group by power state"
    );

    expect(
      screen.getByRole("checkbox", { name: AllCheckboxLabel.AllMachines })
    ).not.toBe("checked");
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/setSelectedMachines")
    ).toStrictEqual({
      type: "machine/setSelectedMachines",
      payload: { filter: {} },
    });
  });

  it("resets the selected machines on filter change", async () => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    state.machine.filters = [
      machineFilterGroupFactory({
        key: FilterGroupKey.Status,
        loaded: true,
        options: [{ key: "status1", label: "Status 1" }],
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
      { store }
    );
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });
    await user.click(
      screen.getByRole("checkbox", { name: AllCheckboxLabel.AllMachines })
    );
    await user.click(
      screen.getByRole("button", { name: MachinesFilterLabels.Toggle })
    );
    await user.click(
      screen.getByRole("tab", { name: MachinesFilterLabels.Status })
    );
    await user.click(screen.getByRole("checkbox", { name: "Status 1" }));

    expect(
      screen.getByRole("checkbox", { name: AllCheckboxLabel.AllMachines })
    ).not.toBe("checked");
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/setSelectedMachines")
    ).toStrictEqual({
      type: "machine/setSelectedMachines",
      payload: { filter: {} },
    });
  });

  it("can search", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineList
        searchFilter="free text workload-service:prod"
        setSearchFilter={jest.fn()}
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

  it("can change pages", () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineList searchFilter="" setSearchFilter={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find(".p-pagination__link--next").simulate("click");
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
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
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
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
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
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
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
      <MachineList searchFilter="" setSearchFilter={jest.fn()} />,
      { state }
    );

    expect(screen.queryByTestId("vault-notification")).not.toBeInTheDocument();
  });
});
