import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import MachineList from "./MachineList";
import { nodeStatus, scriptStatus } from "app/base/enum";

const mockStore = configureStore();

describe("MachineList", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: []
      },
      general: {
        machineActions: {
          data: [],
          loaded: false,
          loading: false
        },
        osInfo: {
          data: {
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']]
          },
          errors: {},
          loaded: true,
          loading: false
        }
      },
      machine: {
        errors: null,
        loading: false,
        loaded: true,
        items: [
          {
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 4,
            cpu_test_status: {
              status: scriptStatus.RUNNING
            },
            distro_series: "bionic",
            domain: {
              name: "example"
            },
            extra_macs: [],
            fqdn: "koala.example",
            hostname: "koala",
            ip_addresses: [],
            memory: 8,
            memory_test_status: {
              status: scriptStatus.PASSED
            },
            network_test_status: {
              status: scriptStatus.PASSED
            },
            osystem: "ubuntu",
            owner: "admin",
            permissions: ["edit", "delete"],
            physical_disk_count: 1,
            pool: {},
            pxe_mac: "00:11:22:33:44:55",
            spaces: [],
            status: "Deployed",
            status_code: nodeStatus.DEPLOYED,
            status_message: "",
            storage: 8,
            storage_test_status: {
              status: scriptStatus.PASSED
            },
            testing_status: {
              status: scriptStatus.PASSED
            },
            system_id: "abc123",
            zone: {}
          },
          {
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 2,
            cpu_test_status: {
              status: scriptStatus.FAILED
            },
            distro_series: "xenial",
            domain: {
              name: "example"
            },
            extra_macs: [],
            fqdn: "other.example",
            hostname: "other",
            ip_addresses: [],
            memory: 6,
            memory_test_status: {
              status: scriptStatus.FAILED
            },
            network_test_status: {
              status: scriptStatus.FAILED
            },
            osystem: "ubuntu",
            owner: "user",
            permissions: ["edit", "delete"],
            physical_disk_count: 2,
            pool: {},
            pxe_mac: "66:77:88:99:00:11",
            spaces: [],
            status: "Releasing",
            status_code: nodeStatus.RELEASING,
            status_message: "",
            storage: 16,
            storage_test_status: {
              status: scriptStatus.FAILED
            },
            testing_status: {
              status: scriptStatus.FAILED
            },
            system_id: "def456",
            zone: {}
          },
          {
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 2,
            cpu_test_status: {
              status: scriptStatus.FAILED
            },
            distro_series: "xenial",
            domain: {
              name: "example"
            },
            extra_macs: [],
            fqdn: "other.example",
            hostname: "other",
            ip_addresses: [],
            memory: 6,
            memory_test_status: {
              status: scriptStatus.FAILED
            },
            network_test_status: {
              status: scriptStatus.FAILED
            },
            osystem: "ubuntu",
            owner: "user",
            permissions: ["edit", "delete"],
            physical_disk_count: 2,
            pool: {},
            pxe_mac: "66:77:88:99:00:11",
            spaces: [],
            status: "Releasing",
            status_code: nodeStatus.DEPLOYED,
            status_message: "",
            storage: 16,
            storage_test_status: {
              status: scriptStatus.FAILED
            },
            testing_status: {
              status: scriptStatus.FAILED
            },
            system_id: "ghi789",
            zone: {}
          }
        ],
        selected: []
      },
      resourcepool: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default"
          },
          {
            id: 1,
            name: "Backup"
          }
        ]
      },
      zone: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default"
          },
          {
            id: 1,
            name: "Backup"
          }
        ]
      }
    };
  });

  it("displays a loading component if machines are loading", () => {
    const state = { ...initialState };
    state.machine.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("can set the search from the URL", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" }
          ]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SearchBox").prop("value")).toBe("test search");
  });

  it("change the URL when the search text changes", () => {
    let location;
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" }
          ]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
          <Route
            path="*"
            render={props => {
              location = props.location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper
        .find("SearchBox")
        .props()
        .onChange("status:new");
    });
    expect(location.search).toBe("?status=new");
  });

  it("includes groups", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .find(".machine-list__group")
        .at(0)
        .find("strong")
        .text()
    ).toBe("Deployed");
    expect(
      wrapper
        .find(".machine-list__group")
        .at(2)
        .find("strong")
        .text()
    ).toBe("Releasing");
  });

  it("can filter groups", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("tr.machine-list__machine").length).toBe(3);
    // Click the button to toggle the group.
    wrapper
      .find(".machine-list__group button")
      .at(0)
      .simulate("click");
    expect(wrapper.find("tr.machine-list__machine").length).toBe(1);
  });

  it("can change groups", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .find(".machine-list__group")
        .at(0)
        .find("strong")
        .text()
    ).toBe("Deployed");
    // Change grouping to owner
    wrapper
      .find('Select[name="machine-groupings"]')
      .find("select")
      .simulate("change", { target: { value: "owner" } });
    expect(
      wrapper
        .find(".machine-list__group")
        .at(0)
        .find("strong")
        .text()
    ).toBe("admin");
  });

  it("can change machines to display PXE MAC instead of FQDN", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    const firstMachine = state.machine.items[0];
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(firstMachine.fqdn);
    // Click the MAC table header
    wrapper
      .find('[data-test="mac-header"]')
      .find("button")
      .simulate("click");
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
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // First machine has more cores than second machine
    const [firstMachine, secondMachine] = [
      state.machine.items[0],
      state.machine.items[1]
    ];

    // Change grouping to none
    wrapper
      .find('Select[name="machine-groupings"]')
      .find("select")
      .simulate("change", { target: { value: "none" } });
    expect(
      wrapper
        .find('[data-test="cores-header"]')
        .find("i")
        .exists()
    ).toBe(false);
    expect(
      wrapper
        .find(".machine-list__machine")
        .at(0)
        .find("TableCell")
        .at(0)
        .text()
    ).toEqual(firstMachine.fqdn);
    // Click the cores table header
    wrapper
      .find('[data-test="cores-header"]')
      .find("button")
      .simulate("click");
    expect(
      wrapper
        .find('[data-test="cores-header"]')
        .find("i")
        .exists()
    ).toBe(true);
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
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const [firstMachine, secondMachine] = [
      state.machine.items[0],
      state.machine.items[1]
    ];

    // Change grouping to none
    wrapper
      .find('Select[name="machine-groupings"]')
      .find("select")
      .simulate("change", { target: { value: "none" } });

    // Click the status table header
    wrapper
      .find('[data-test="status-header"]')
      .find("button")
      .simulate("click");
    expect(
      wrapper
        .find('[data-test="status-header"]')
        .find("i")
        .exists()
    ).toBe(true);
    expect(
      wrapper
        .find('[data-test="status-header"]')
        .find("i")
        .props().className
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
      wrapper
        .find('[data-test="status-header"]')
        .find("i")
        .props().className
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
    expect(
      wrapper
        .find('[data-test="status-header"]')
        .find("i")
        .exists()
    ).toBe(false);
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
    state.machine.items[1].status_code = nodeStatus.DEPLOYED;
    state.machine.selected = [state.machine.items[0].system_id];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList
            selectedMachines={[state.machine.items[0]]}
            setSelectedMachines={jest.fn()}
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

  it("can display an error", () => {
    const state = { ...initialState };
    state.machine.errors = "Uh oh!";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").text()).toBe("Uh oh!");
  });

  it("can display a list of errors", () => {
    const state = { ...initialState };
    state.machine.errors = ["Uh oh!", "It broke"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").text()).toBe("Uh oh! It broke");
  });

  it("can display a collection of errors", () => {
    const state = { ...initialState };
    state.machine.errors = { machine: "Uh oh!", network: "It broke" };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("Notification").text()).toBe(
      "machine: Uh oh! network: It broke"
    );
  });

  it("displays a message if there are no search results", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineList selectedMachines={[]} setSelectedMachines={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("input[type='search']")
      .simulate("change", { target: { value: "test" } });
    expect(wrapper.find("Strip span").text()).toBe(
      "No machines match the search criteria."
    );
  });

  describe("Machine selection", () => {
    it("shows a checked checkbox in machine row if it is selected", () => {
      const state = { ...initialState };
      state.machine.selected = ["abc123"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper
          .find("[data-test='name-column'] input")
          .at(0)
          .props().checked
      ).toBe(true);
    });

    it(`shows a checked checkbox in group row if all machines in the group
      are selected`, () => {
      const state = { ...initialState };
      state.machine.selected = ["abc123", "ghi789"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("[data-test='group-cell'] input[checked=true]").length
      ).toBe(1);
    });

    it("shows a checked checkbox in header row if all machines are selected", () => {
      const state = { ...initialState };
      state.machine.items[1].status_code = nodeStatus.DEPLOYED;
      state.machine.selected = ["abc123", "def456", "ghi789"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("[data-test='all-machines-checkbox'] input[checked=true]")
          .length
      ).toBe(1);
    });

    it("correctly dispatches action when unchecked machine checkbox clicked", () => {
      const state = { ...initialState };
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='name-column'] input")
        .at(0)
        .simulate("change", {
          target: { name: state.machine.items[0].system_id }
        });
      // Machine not selected => select machine
      expect(
        store
          .getActions()
          .find(action => action.type === "SET_SELECTED_MACHINES")
      ).toStrictEqual({
        type: "SET_SELECTED_MACHINES",
        payload: ["abc123"]
      });
    });

    it("correctly dispatches action when checked machine checkbox clicked", () => {
      const state = { ...initialState };
      state.machine.selected = ["abc123"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='name-column'] input")
        .at(0)
        .simulate("change", {
          target: { name: state.machine.items[0].system_id }
        });
      // Machine selected => unselect machine
      expect(
        store
          .getActions()
          .find(action => action.type === "SET_SELECTED_MACHINES")
      ).toStrictEqual({
        type: "SET_SELECTED_MACHINES",
        payload: []
      });
    });

    it("correctly dispatches action when unchecked group checkbox clicked", () => {
      const state = { ...initialState };
      state.machine.selected = ["abc123"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='group-cell'] input")
        .at(0)
        .simulate("change", {
          target: { name: state.machine.items[0].system_id }
        });
      // Not all machines in group selected => select machines in group
      expect(
        store
          .getActions()
          .find(action => action.type === "SET_SELECTED_MACHINES")
      ).toStrictEqual({
        type: "SET_SELECTED_MACHINES",
        payload: ["abc123", "ghi789"]
      });
    });

    it("correctly dispatches action when checked group checkbox clicked", () => {
      const state = { ...initialState };
      state.machine.selected = ["abc123", "def456", "ghi789"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='group-cell'] input")
        .at(0)
        .simulate("change", {
          target: { name: state.machine.items[0].system_id }
        });
      // All machines in group selected => unselect machines in group
      expect(
        store
          .getActions()
          .find(action => action.type === "SET_SELECTED_MACHINES")
      ).toStrictEqual({
        type: "SET_SELECTED_MACHINES",
        payload: ["def456"]
      });
    });

    it("correctly dispatches action when unchecked header checkbox clicked", () => {
      const state = { ...initialState };
      state.machine.selected = ["abc123"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='all-machines-checkbox'] input")
        .at(0)
        .simulate("change", {
          target: { name: state.machine.items[0].system_id }
        });
      // Not all machines selected => select all machines
      expect(
        store
          .getActions()
          .find(action => action.type === "SET_SELECTED_MACHINES")
      ).toStrictEqual({
        type: "SET_SELECTED_MACHINES",
        payload: ["abc123", "def456", "ghi789"]
      });
    });

    it("correctly dispatches action when checked header checkbox clicked", () => {
      const state = { ...initialState };
      state.machine.selected = ["abc123", "def456", "ghi789"];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <MachineList />
          </MemoryRouter>
        </Provider>
      );
      wrapper
        .find("[data-test='all-machines-checkbox'] input")
        .at(0)
        .simulate("change", {
          target: { name: state.machine.items[0].system_id }
        });
      // All machines already selected => unselect all machines
      expect(
        store
          .getActions()
          .find(action => action.type === "SET_SELECTED_MACHINES")
      ).toStrictEqual({
        type: "SET_SELECTED_MACHINES",
        payload: []
      });
    });
  });
});
