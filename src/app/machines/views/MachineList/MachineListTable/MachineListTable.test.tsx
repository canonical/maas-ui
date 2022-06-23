import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { MachineListTable } from "./MachineListTable";

import type { Machine } from "app/store/machine/types";
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
} from "testing/factories";

const mockStore = configureStore();

describe("MachineListTable", () => {
  let state: RootState;
  let machines: Machine[] = [];

  beforeEach(() => {
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
        loaded: true,
        items: machines,
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

  it("includes groups", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
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

  it("can change machines to display PXE MAC instead of FQDN", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const firstMachine = machines[0];
    expect(
      wrapper.find(".machine-list__machine").at(0).find("RowCheckbox").text()
    ).toEqual(firstMachine.fqdn);
    // Click the MAC table header
    wrapper.find('[data-testid="mac-header"]').find("button").simulate("click");
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("RowCheckbox")
        .at(0)
        .text()
    ).toEqual(firstMachine.pxe_mac);
  });

  it("updates sort on header click", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              filter=""
              grouping="none"
              hiddenGroups={[]}
              machines={machines}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // First machine has more cores than second machine
    const [firstMachine, secondMachine] = [machines[0], machines[1]];

    expect(
      wrapper.find('[data-testid="cores-header"]').find("i").exists()
    ).toBe(false);
    expect(
      wrapper.find(".machine-list__machine").at(0).find("RowCheckbox").text()
    ).toEqual(firstMachine.fqdn);
    // Click the cores table header
    wrapper
      .find('[data-testid="cores-header"]')
      .find("button")
      .simulate("click");
    expect(
      wrapper.find('[data-testid="cores-header"]').find("i").exists()
    ).toBe(true);
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("RowCheckbox")
        .at(0)
        .text()
    ).toEqual(secondMachine.fqdn);
  });

  it("updates sort direction on multiple header clicks", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              filter=""
              grouping="none"
              hiddenGroups={[]}
              machines={machines}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const [firstMachine, secondMachine] = [machines[0], machines[1]];

    // Click the status table header
    wrapper
      .find('[data-testid="status-header"]')
      .find("button")
      .simulate("click");
    expect(
      wrapper.find('[data-testid="status-header"]').find("i").exists()
    ).toBe(true);
    expect(
      wrapper.find('[data-testid="status-header"]').find("i").props().className
    ).toBe("p-icon--chevron-down");
    expect(
      wrapper.find(".machine-list__machine").at(0).find("RowCheckbox").text()
    ).toEqual(firstMachine.fqdn);

    // Click the status table header again to reverse sort order
    wrapper
      .find('[data-testid="status-header"]')
      .find("button")
      .simulate("click");
    expect(
      wrapper.find('[data-testid="status-header"]').find("i").props().className
    ).toBe("p-icon--chevron-up");
    expect(
      wrapper.find(".machine-list__machine").at(0).find("RowCheckbox").text()
    ).toEqual(secondMachine.fqdn);

    // Click the FQDN table header again to return to no sort
    wrapper
      .find('[data-testid="status-header"]')
      .find("button")
      .simulate("click");
    expect(
      wrapper.find('[data-testid="status-header"]').find("i").exists()
    ).toBe(false);
    expect(
      wrapper.find(".machine-list__machine").at(0).find("RowCheckbox").text()
    ).toEqual(firstMachine.fqdn);
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
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={[machines[0].system_id]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
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
    ).toEqual("3 machines, 1 selected");
  });

  describe("Machine selection", () => {
    it("shows a checked checkbox in machine row if it is selected", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={["abc123"]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("[data-testid='name-column'] input").at(0).props().checked
      ).toBe(true);
    });

    it(`shows a checked checkbox in group row if all machines in the group
      are selected`, () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={["abc123", "ghi789"]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("[data-testid='group-cell'] input[checked=true]").length
      ).toBe(1);
      expect(
        wrapper
          .find("[data-testid='group-cell'] input")
          .at(0)
          .prop("aria-checked")
      ).not.toBe("mixed");
    });

    it("shows a checked checkbox in header row if all machines are selected", () => {
      machines[1].status_code = NodeStatusCode.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={["abc123", "def456", "ghi789"]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find(
          "[data-testid='all-machines-checkbox'] input[checked=true]"
        ).length
      ).toBe(1);
      expect(
        wrapper
          .find("[data-testid='all-machines-checkbox'] input")
          .prop("aria-checked")
      ).not.toBe("mixed");
    });

    it("correctly dispatches action when unchecked machine checkbox clicked", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-testid='name-column'] input")
        .at(0)
        .simulate("change", {
          target: { name: machines[0].system_id },
        });
      // Machine not selected => select machine
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/setSelected")
      ).toStrictEqual({
        type: "machine/setSelected",
        payload: ["abc123"],
      });
    });

    it("correctly dispatches action when checked machine checkbox clicked", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={["abc123"]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-testid='name-column'] input")
        .at(0)
        .simulate("change", {
          target: { name: machines[0].system_id },
        });
      // Machine selected => unselect machine
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/setSelected")
      ).toStrictEqual({
        type: "machine/setSelected",
        payload: [],
      });
    });

    it("correctly dispatches action when unchecked group checkbox clicked", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={[]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-testid='group-cell'] input")
        .at(0)
        .simulate("change", {
          target: { name: machines[0].system_id },
        });
      // No machines in group selected => select machines in group
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/setSelected")
      ).toStrictEqual({
        type: "machine/setSelected",
        payload: ["abc123", "ghi789"],
      });
    });

    it("correctly dispatches action when checked group checkbox clicked", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={["abc123", "def456", "ghi789"]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-testid='group-cell'] input")
        .at(0)
        .simulate("change", {
          target: { name: machines[0].system_id },
        });
      // All machines in group selected => unselect machines in group
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/setSelected")
      ).toStrictEqual({
        type: "machine/setSelected",
        payload: ["def456"],
      });
    });

    it("shows group checkbox in mixed selection state if some machines selected", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={["abc123"]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper
          .find("[data-testid='group-cell'] input")
          .at(0)
          .prop("aria-checked")
      ).toBe("mixed");
    });

    it("correctly dispatches action when unchecked header checkbox clicked", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={[]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-testid='all-machines-checkbox'] input")
        .at(0)
        .simulate("change", {
          target: { name: machines[0].system_id },
        });
      // No machines selected => select all machines
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/setSelected")
      ).toStrictEqual({
        type: "machine/setSelected",
        payload: ["abc123", "def456", "ghi789"],
      });
    });

    it("correctly dispatches action when checked header checkbox clicked", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={machines}
                selectedIDs={["abc123", "def456", "ghi789"]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-testid='all-machines-checkbox'] input")
        .at(0)
        .simulate("change", {
          target: { name: machines[0].system_id },
        });
      // All machines already selected => unselect all machines
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/setSelected")
      ).toStrictEqual({
        type: "machine/setSelected",
        payload: [],
      });
    });

    it("disables checkbox in header row if there are no machines", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <CompatRouter>
              <MachineListTable
                filter=""
                grouping="status"
                hiddenGroups={[]}
                machines={[]}
                setHiddenGroups={jest.fn()}
                setSearchFilter={jest.fn()}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper
          .find("[data-testid='all-machines-checkbox'] input[checked=true]")
          .exists()
      ).toBe(false);
      expect(
        wrapper
          .find("[data-testid='all-machines-checkbox'] input[disabled]")
          .exists()
      ).toBe(true);
    });
  });

  it("shows header checkbox in mixed selection state if some machines selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("[data-testid='all-machines-checkbox'] input")
        .at(0)
        .prop("aria-checked")
    ).toBe("mixed");
  });

  it("remove selected filter when unchecking the only checked machine", () => {
    const store = mockStore(state);
    const setSearchFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              filter="in:selected"
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={setSearchFilter}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("[data-testid='name-column'] input")
      .at(0)
      .simulate("change", {
        target: { name: machines[0].system_id },
      });
    expect(setSearchFilter).toHaveBeenCalledWith("");
  });

  it("remove selected filter when unchecking the only checked group", () => {
    const store = mockStore(state);
    const setSearchFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              filter="in:selected"
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={setSearchFilter}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("[data-testid='group-cell'] input")
      .at(0)
      .simulate("change", {
        target: { name: machines[0].system_id },
      });
    expect(setSearchFilter).toHaveBeenCalledWith("");
  });

  it("remove selected filter when unchecking the all machines checkbox", () => {
    const store = mockStore(state);
    const setSearchFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable
              filter="in:selected"
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123", "def456", "ghi789"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={setSearchFilter}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("[data-testid='all-machines-checkbox'] input")
      .at(0)
      .simulate("change", {
        target: { name: machines[0].system_id },
      });
    expect(setSearchFilter).toHaveBeenCalledWith("");
  });

  it("does not show checkboxes if showActions is false", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineListTable machines={machines} showActions={false} />
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
                hiddenColumns={["power", "zone"]}
                machines={machines}
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
                hiddenColumns={["fqdn"]}
                machines={machines}
                showActions
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
                hiddenColumns={["fqdn"]}
                machines={machines}
                showActions={false}
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
