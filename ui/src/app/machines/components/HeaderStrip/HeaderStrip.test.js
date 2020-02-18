import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { nodeStatus, scriptStatus } from "app/base/enum";
import HeaderStrip from "./HeaderStrip";

const mockStore = configureStore();

describe("HeaderStrip", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: []
      },
      general: {
        osInfo: {
          data: {
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']]
          },
          errors: {},
          loaded: true,
          loading: false
        },
        machineActions: {
          data: [],
          errors: {},
          loaded: true,
          loading: false
        },
        navigationOptions: {
          data: {
            rsd: false
          }
        }
      },
      messages: {
        items: []
      },
      machine: {
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
            permissions: ["edit", "delete"],
            physical_disk_count: 1,
            pool: {},
            pxe_mac: "00:11:22:33:44:55",
            spaces: [],
            status: "Releasing",
            status_code: nodeStatus.RELEASING,
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
          }
        ]
      },
      resourcepool: {
        loaded: false,
        items: [1, 2]
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

  it("displays a loader if machines have not loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={[]} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("displays a machine count if machines have loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={[]} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="machine-count"]').text()).toBe(
      "1 machine available"
    );
  });

  it("displays tabs with machine and resource pool counts if loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    state.resourcepool.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={[]} />
        </MemoryRouter>
      </Provider>
    );
    const tabs = wrapper.find('[data-test="machine-list-tabs"]');
    expect(
      tabs
        .find("Link")
        .at(0)
        .text()
    ).toBe("1 Machine");
    expect(
      tabs
        .find("Link")
        .at(1)
        .text()
    ).toBe("2 Resource pools");
  });

  it(`displays RSD link in add hardware dropdown if shown
    in navigation`, () => {
    const state = { ...initialState };
    state.general.navigationOptions.data.rsd = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={[]} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="add-hardware-dropdown"]').props().links.length
    ).toBe(3);
    expect(
      wrapper.find('[data-test="add-hardware-dropdown"]').props().links[2]
        .children
    ).toBe("RSD");
  });

  it("displays add hardware menu and not add pool when at machines route", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={[]} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('ContextualMenu[data-test="add-hardware-dropdown"]').length
    ).toBe(1);
    expect(wrapper.find('Button[data-test="add-pool"]').length).toBe(0);
  });

  it(`displays add pool button and not hardware dropdown when
    at pools route`, () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <HeaderStrip selectedMachines={[]} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Button[data-test="add-pool"]').length).toBe(1);
    expect(
      wrapper.find('Button[data-test="add-hardware-dropdown"]').length
    ).toBe(0);
  });

  it("disables take action menu if no are machines selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={[]} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="take-action-dropdown"] button').props().disabled
    ).toBe(true);
  });

  it(`enables take action menu and displays number of selected machines if
    at least one selected`, () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={[state.machine.items[0]]} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="selected-count"]').text()).toBe(
      "1 selected"
    );
    expect(
      wrapper.find('[data-test="take-action-dropdown"] button').props().disabled
    ).toBe(false);
  });

  it(`displays all lifecycle actions in action menu, but disables buttons for
    those in which selected machines cannot perform`, () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      { name: "lifecycle1", title: "Lifecycle 1", type: "lifecycle" },
      { name: "lifecycle2", title: "Lifecycle 2", type: "lifecycle" },
      { name: "lifecycle3", title: "Lifecycle 3", type: "lifecycle" }
    ];
    // No machine can perform "lifecycle3" action
    state.machine.items = [
      { actions: ["lifecycle1", "lifecycle2"] },
      { actions: ["lifecycle1"] },
      { actions: ["other"] }
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={state.machine.items} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("button.p-contextual-menu__link").length).toBe(3);
    expect(wrapper.find("[data-test='action-title-lifecycle1']").text()).toBe(
      "Lifecycle 1"
    );
    expect(wrapper.find("[data-test='action-title-lifecycle2']").text()).toBe(
      "Lifecycle 2"
    );
    expect(wrapper.find("[data-test='action-title-lifecycle3']").text()).toBe(
      "Lifecycle 3"
    );
    // Lifecycle 3 action displays, but is disabled
    expect(
      wrapper
        .find("button.p-contextual-menu__link")
        .at(2)
        .props().disabled
    ).toBe(true);
  });

  it(`filters non-lifecycle actions from action menu if no selected machine
    can perform the action`, () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      { name: "on", title: "Power on...", type: "power" },
      { name: "off", title: "Power off...", type: "power" },
      { name: "house", title: "Power house...", type: "power" }
    ];
    // No machine can perform "house" action
    state.machine.items = [
      { actions: ["on", "off"] },
      { actions: ["on"] },
      { actions: ["off"] }
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={state.machine.items} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("button.p-contextual-menu__link").length).toBe(2);
    expect(wrapper.find("[data-test='action-title-on']").text()).toBe(
      "Power on..."
    );
    expect(wrapper.find("[data-test='action-title-off']").text()).toBe(
      "Power off..."
    );
  });

  it(`correctly calculates number of machines that can perform each action
    in action menu`, () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      { name: "commission", title: "Commission...", type: "lifecycle" },
      { name: "release", title: "Release...", type: "lifecycle" },
      { name: "deploy", title: "Deploy...", type: "lifecycle" }
    ];
    // 3 commission, 2 release, 1 deploy
    state.machine.items = [
      { actions: ["commission", "release", "deploy"] },
      { actions: ["commission", "release"] },
      { actions: ["commission"] }
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={state.machine.items} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("button.p-contextual-menu__link").length).toBe(3);
    expect(wrapper.find("[data-test='action-count-commission']").text()).toBe(
      "3"
    );
    expect(wrapper.find("[data-test='action-count-release']").text()).toBe("2");
    expect(wrapper.find("[data-test='action-count-deploy']").text()).toBe("1");
  });

  it(`displays all actions a machine can take, without count, if only one
  machine is selected`, () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      { name: "action1", title: "Action 1", type: "power" },
      { name: "action2", title: "Action 2", type: "power" }
    ];
    // No machine can perform "lifecycle3" action
    state.machine.items = [{ actions: ["action1"] }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={[state.machine.items[0]]} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="take-action-dropdown"] button').simulate("click");
    expect(wrapper.find("[data-test='action-title-action1']").text()).toBe(
      "Action 1"
    );
    expect(wrapper.find("[data-test='action-count-action1']").exists()).toBe(
      false
    );
  });

  it("groups actions in action menu by type", () => {
    const state = { ...initialState };
    state.general.machineActions.data = [
      { name: "commission", title: "Commission...", type: "lifecycle" },
      { name: "on", title: "Power on...", type: "power" },
      { name: "off", title: "Power on...", type: "power" },
      { name: "test", title: "Test...", type: "testing" },
      { name: "lock", title: "Lock...", type: "lock" },
      { name: "set-pool", title: "Set pool...", type: "misc" },
      { name: "set-zone", title: "Set zone...", type: "misc" },
      { name: "delete", title: "Delete...", type: "misc" }
    ];
    state.machine.items = [
      {
        actions: [
          "commission",
          "on",
          "off",
          "test",
          "lock",
          "set-pool",
          "set-zone",
          "delete"
        ]
      }
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStrip selectedMachines={state.machine.items} />
        </MemoryRouter>
      </Provider>
    );
    const links = wrapper.find('[data-test="take-action-dropdown"]').props()
      .links;
    expect(links[0].length).toBe(1);
    expect(links[1].length).toBe(2);
    expect(links[2].length).toBe(1);
    expect(links[3].length).toBe(1);
    expect(links[4].length).toBe(3);
  });
});
