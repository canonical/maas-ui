import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { nodeStatus, scriptStatus } from "app/base/enum";
import StatusColumn from "./StatusColumn";

const mockStore = configureStore();

describe("StatusColumn", () => {
  let state;
  beforeEach(() => {
    state = {
      general: {
        machineActions: {
          data: [],
        },
        osInfo: {
          data: {
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
            ],
          },
          errors: {},
          loaded: true,
          loading: false,
        },
      },
      machine: {
        items: [
          {
            actions: [],
            distro_series: "bionic",
            osystem: "ubuntu",
            status: "New",
            status_code: 0,
            status_message: "",
            testing_status: {
              status: scriptStatus.NONE,
            },
            system_id: "abc123",
          },
        ],
        errors: {},
        loaded: true,
        loading: false,
      },
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StatusColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("StatusColumn")).toMatchSnapshot();
  });

  describe("status text", () => {
    it("displays the machine's status if not deploying or deployed", () => {
      state.machine.items[0].status = "New";
      state.machine.items[0].status_code = nodeStatus.NEW;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='status-text']").text()).toBe("New");
    });

    it("displays the short-form of Ubuntu release if deployed", () => {
      state.machine.items[0].status = "Deployed";
      state.machine.items[0].status_code = nodeStatus.DEPLOYED;
      state.machine.items[0].osystem = "ubuntu";
      state.machine.items[0].distro_series = "bionic";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='status-text']").text()).toBe(
        "Ubuntu 18.04 LTS"
      );
    });

    it("displays the full OS and release if non-Ubuntu deployed", () => {
      state.machine.items[0].status = "Deployed";
      state.machine.items[0].status_code = nodeStatus.DEPLOYED;
      state.machine.items[0].osystem = "centos";
      state.machine.items[0].distro_series = "centos70";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='status-text']").text()).toBe("CentOS 7");
    });

    it("displays 'Deploying OS release' if machine is deploying", () => {
      state.machine.items[0].status = "Deploying";
      state.machine.items[0].status_code = nodeStatus.DEPLOYING;
      state.machine.items[0].osystem = "ubuntu";
      state.machine.items[0].distro_series = "bionic";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='status-text']").text()).toBe(
        "Deploying Ubuntu 18.04 LTS"
      );
    });
  });

  describe("progress text", () => {
    it("displays the machine's status_message if in a transient state", () => {
      state.machine.items[0].status = "Testing";
      state.machine.items[0].status_code = nodeStatus.TESTING;
      state.machine.items[0].status_message = "2 of 6 tests complete";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='progress-text']").text()).toBe(
        "2 of 6 tests complete"
      );
    });

    it(`does not display the machine's status_message if
      not in a transient state`, () => {
      state.machine.items[0].status = "Allocated";
      state.machine.items[0].status_code = nodeStatus.ALLOCATED;
      state.machine.items[0].status_message = "This machine is allocated";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='progress-text']").text()).toBe("");
    });
  });

  describe("status icon", () => {
    it("shows a spinner if machine is in a transient state", () => {
      state.machine.items[0].status = "Commissioning";
      state.machine.items[0].status_code = nodeStatus.COMMISSIONING;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find(".p-icon--spinner").exists()).toBe(true);
    });

    it(`shows a warning and tooltip if machine has failed tests and is not in a
      state where the warning should be hidden`, () => {
      state.machine.items[0].status = "Allocated";
      state.machine.items[0].status_code = nodeStatus.ALLOCATED;
      state.machine.items[0].testing_status.status = scriptStatus.FAILED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find(".p-icon--warning").exists()).toBe(true);
      expect(wrapper.find("Tooltip").exists()).toBe(true);
    });
  });

  it("can show a menu with all possible options", () => {
    state.machine.items[0].actions = [
      "abort",
      "acquire",
      "commission",
      "deploy",
      "exit-rescue-mode",
      "lock",
      "mark-broken",
      "mark-fixed",
      "override-failed-testing",
      "release",
      "rescue-mode",
      "test",
      "unlock",
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StatusColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find(".p-contextual-menu__dropdown")).toMatchSnapshot();
  });
});
