import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { MachineListTable } from "./MachineListTable";

import { ScriptResultStatus } from "app/store/scriptresult/types";
import { NodeStatusCode } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineListTable", () => {
  let initialState;
  let machines = [];

  beforeEach(() => {
    machines = [
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 4,
        cpu_test_status: {
          status: ScriptResultStatus.RUNNING,
        },
        distro_series: "bionic",
        domain: {
          name: "example",
        },
        extra_macs: [],
        fqdn: "koala.example",
        hostname: "koala",
        ip_addresses: [],
        memory: 8,
        memory_test_status: {
          status: ScriptResultStatus.PASSED,
        },
        network_test_status: {
          status: ScriptResultStatus.PASSED,
        },
        osystem: "ubuntu",
        owner: "admin",
        permissions: ["edit", "delete"],
        physical_disk_count: 1,
        pool: {},
        pxe_mac: "00:11:22:33:44:55",
        spaces: [],
        status: "Deployed",
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 8,
        storage_test_status: {
          status: ScriptResultStatus.PASSED,
        },
        testing_status: {
          status: ScriptResultStatus.PASSED,
        },
        system_id: "abc123",
        zone: {},
      }),
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 2,
        cpu_test_status: {
          status: ScriptResultStatus.FAILED,
        },
        distro_series: "xenial",
        domain: {
          name: "example",
        },
        extra_macs: [],
        fqdn: "other.example",
        hostname: "other",
        ip_addresses: [],
        memory: 6,
        memory_test_status: {
          status: ScriptResultStatus.FAILED,
        },
        network_test_status: {
          status: ScriptResultStatus.FAILED,
        },
        osystem: "ubuntu",
        owner: "user",
        permissions: ["edit", "delete"],
        physical_disk_count: 2,
        pool: {},
        pxe_mac: "66:77:88:99:00:11",
        spaces: [],
        status: "Releasing",
        status_code: NodeStatusCode.RELEASING,
        status_message: "",
        storage: 16,
        storage_test_status: {
          status: ScriptResultStatus.FAILED,
        },
        testing_status: {
          status: ScriptResultStatus.FAILED,
        },
        system_id: "def456",
        zone: {},
      }),
      machineFactory({
        actions: [],
        architecture: "amd64/generic",
        cpu_count: 2,
        cpu_test_status: {
          status: ScriptResultStatus.FAILED,
        },
        distro_series: "xenial",
        domain: {
          name: "example",
        },
        extra_macs: [],
        fqdn: "other.example",
        hostname: "other",
        ip_addresses: [],
        memory: 6,
        memory_test_status: {
          status: ScriptResultStatus.FAILED,
        },
        network_test_status: {
          status: ScriptResultStatus.FAILED,
        },
        osystem: "ubuntu",
        owner: "user",
        permissions: ["edit", "delete"],
        physical_disk_count: 2,
        pool: {},
        pxe_mac: "66:77:88:99:00:11",
        spaces: [],
        status: "Releasing",
        status_code: NodeStatusCode.DEPLOYED,
        status_message: "",
        storage: 16,
        storage_test_status: {
          status: ScriptResultStatus.FAILED,
        },
        testing_status: {
          status: ScriptResultStatus.FAILED,
        },
        system_id: "ghi789",
        zone: {},
      }),
    ];
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: {
          data: [],
          loaded: false,
          loading: false,
        },
        osInfo: {
          data: {
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          },
          errors: {},
          loaded: true,
          loading: false,
        },
      }),
      machine: machineStateFactory({
        loaded: true,
        items: machines,
      }),
      resourcepool: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default",
          },
          {
            id: 1,
            name: "Backup",
          },
        ],
      },
      zone: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default",
          },
          {
            id: 1,
            name: "Backup",
          },
        ],
      },
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("includes groups", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter=""
            grouping="status"
            hiddenGroups={[]}
            machines={machines}
            setHiddenGroups={jest.fn()}
            setSearchFilter={jest.fn()}
          />
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
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter=""
            grouping="status"
            hiddenGroups={[]}
            machines={machines}
            setHiddenGroups={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    const firstMachine = machines[0];
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(firstMachine.fqdn);
    // Click the MAC table header
    wrapper.find('[data-test="mac-header"]').find("button").simulate("click");
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(firstMachine.pxe_mac);
  });

  it("updates sort on header click", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter=""
            grouping="none"
            hiddenGroups={[]}
            machines={machines}
            setHiddenGroups={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    // First machine has more cores than second machine
    const [firstMachine, secondMachine] = [machines[0], machines[1]];

    expect(wrapper.find('[data-test="cores-header"]').find("i").exists()).toBe(
      false
    );
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(firstMachine.fqdn);
    // Click the cores table header
    wrapper.find('[data-test="cores-header"]').find("button").simulate("click");
    expect(wrapper.find('[data-test="cores-header"]').find("i").exists()).toBe(
      true
    );
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(secondMachine.fqdn);
  });

  it("updates sort direction on multiple header clicks", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter=""
            grouping="none"
            hiddenGroups={[]}
            machines={machines}
            setHiddenGroups={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    const [firstMachine, secondMachine] = [machines[0], machines[1]];

    // Click the status table header
    wrapper
      .find('[data-test="status-header"]')
      .find("button")
      .simulate("click");
    expect(wrapper.find('[data-test="status-header"]').find("i").exists()).toBe(
      true
    );
    expect(
      wrapper.find('[data-test="status-header"]').find("i").props().className
    ).toBe("p-icon--contextual-menu");
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(firstMachine.fqdn);

    // Click the status table header again to reverse sort order
    wrapper
      .find('[data-test="status-header"]')
      .find("button")
      .simulate("click");
    expect(
      wrapper.find('[data-test="status-header"]').find("i").props().className
    ).toBe("p-icon--contextual-menu u-mirror--y");
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(secondMachine.fqdn);

    // Click the FQDN table header again to return to no sort
    wrapper
      .find('[data-test="status-header"]')
      .find("button")
      .simulate("click");
    expect(wrapper.find('[data-test="status-header"]').find("i").exists()).toBe(
      false
    );
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(firstMachine.fqdn);
  });

  it("displays correct selected string in group header", () => {
    const state = { ...initialState };
    machines[1].status_code = NodeStatusCode.DEPLOYED;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter=""
            grouping="status"
            hiddenGroups={[]}
            machines={machines}
            selectedIDs={[machines[0].system_id]}
            setHiddenGroups={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("[data-test='group-cell'] .p-double-row__secondary-row")
        .at(0)
        .text()
    ).toEqual("3 machines, 1 selected");
  });

  describe("Machine selection", () => {
    it("shows a checked checkbox in machine row if it is selected", () => {
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("[data-test='name-column'] input").at(0).props().checked
      ).toBe(true);
    });

    it(`shows a checked checkbox in group row if all machines in the group
      are selected`, () => {
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123", "ghi789"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("[data-test='group-cell'] input[checked=true]").length
      ).toBe(1);
      expect(
        wrapper
          .find("[data-test='group-cell'] input")
          .at(0)
          .props()
          .className.includes("p-checkbox--mixed")
      ).toBe(false);
    });

    it("shows a checked checkbox in header row if all machines are selected", () => {
      const state = { ...initialState };
      machines[1].status_code = NodeStatusCode.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123", "def456", "ghi789"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("[data-test='all-machines-checkbox'] input[checked=true]")
          .length
      ).toBe(1);
      expect(
        wrapper
          .find("[data-test='all-machines-checkbox'] input")
          .props()
          .className.includes("p-checkbox--mixed")
      ).toBe(false);
    });

    it("correctly dispatches action when unchecked machine checkbox clicked", () => {
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='name-column'] input")
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
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='name-column'] input")
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
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={[]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='group-cell'] input")
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
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123", "def456", "ghi789"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='group-cell'] input")
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
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper
          .find("[data-test='group-cell'] input")
          .at(0)
          .props()
          .className.includes("p-checkbox--mixed")
      ).toBe(true);
    });

    it("correctly dispatches action when unchecked header checkbox clicked", () => {
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={[]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='all-machines-checkbox'] input")
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
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={machines}
              selectedIDs={["abc123", "def456", "ghi789"]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='all-machines-checkbox'] input")
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
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              filter=""
              grouping="status"
              hiddenGroups={[]}
              machines={[]}
              setHiddenGroups={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper
          .find("[data-test='all-machines-checkbox'] input[checked=true]")
          .exists()
      ).toBe(false);
      expect(
        wrapper
          .find("[data-test='all-machines-checkbox'] input[disabled]")
          .exists()
      ).toBe(true);
    });
  });

  it("shows header checkbox in mixed selection state if some machines selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter=""
            grouping="status"
            hiddenGroups={[]}
            machines={machines}
            selectedIDs={["abc123"]}
            setHiddenGroups={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("[data-test='all-machines-checkbox'] input")
        .at(0)
        .props()
        .className.includes("p-checkbox--mixed")
    ).toBe(true);
  });

  it("remove selected filter when unchecking the only checked machine", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const setSearchFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter="in:selected"
            grouping="status"
            hiddenGroups={[]}
            machines={machines}
            selectedIDs={["abc123"]}
            setHiddenGroups={jest.fn()}
            setSearchFilter={setSearchFilter}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("[data-test='name-column'] input")
      .at(0)
      .simulate("change", {
        target: { name: machines[0].system_id },
      });
    expect(setSearchFilter).toHaveBeenCalledWith("");
  });

  it("remove selected filter when unchecking the only checked group", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const setSearchFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter="in:selected"
            grouping="status"
            hiddenGroups={[]}
            machines={machines}
            selectedIDs={["abc123"]}
            setHiddenGroups={jest.fn()}
            setSearchFilter={setSearchFilter}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("[data-test='group-cell'] input")
      .at(0)
      .simulate("change", {
        target: { name: machines[0].system_id },
      });
    expect(setSearchFilter).toHaveBeenCalledWith("");
  });

  it("remove selected filter when unchecking the all machines checkbox", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const setSearchFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable
            filter="in:selected"
            grouping="status"
            hiddenGroups={[]}
            machines={machines}
            selectedIDs={["abc123", "def456", "ghi789"]}
            setHiddenGroups={jest.fn()}
            setSearchFilter={setSearchFilter}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("[data-test='all-machines-checkbox'] input")
      .at(0)
      .simulate("change", {
        target: { name: machines[0].system_id },
      });
    expect(setSearchFilter).toHaveBeenCalledWith("");
  });

  it("does not show checkboxes if showActions is false", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListTable machines={machines} showActions={false} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='all-machines-checkbox'] input").exists()
    ).toBe(false);
    expect(wrapper.find("[data-test='group-cell'] input").exists()).toBe(false);
    expect(wrapper.find("[data-test='name-column'] input").exists()).toBe(
      false
    );
  });

  describe("hiddenColumns", () => {
    it("can hide columns", () => {
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              hiddenColumns={["power", "zone"]}
              machines={machines}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('[data-test="status-header"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="status-column"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="power-header"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="power-column"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="zone-header"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="zone-column"]').exists()).toBe(false);
    });

    it("still displays fqdn if showActions is true", () => {
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              hiddenColumns={["fqdn"]}
              machines={machines}
              showActions
            />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('[data-test="fqdn-header"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="fqdn-column"]').exists()).toBe(true);
    });

    it("hides fqdn if if showActions is false", () => {
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineListTable
              hiddenColumns={["fqdn"]}
              machines={machines}
              showActions={false}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('[data-test="fqdn-header"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="fqdn-column"]').exists()).toBe(false);
    });
  });
});
