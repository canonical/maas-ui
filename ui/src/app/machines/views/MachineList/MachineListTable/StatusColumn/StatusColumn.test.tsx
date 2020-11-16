import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { nodeStatus, scriptStatus } from "app/base/enum";
import { StatusColumn } from "./StatusColumn";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import type { TestResult } from "app/store/types/node";
import { NodeStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  generalState as generalStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StatusColumn", () => {
  let state: RootState;
  let machine: Machine;

  beforeEach(() => {
    machine = machineFactory({
      actions: [],
      distro_series: "bionic",
      osystem: "ubuntu",
      status: NodeStatus.NEW,
      status_code: 0,
      status_message: "",
      system_id: "abc123",
    });
    state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          data: osInfoFactory({
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
            ],
          }),
          errors: {},
          loaded: true,
          loading: false,
        }),
      }),
      machine: machineStateFactory({
        items: [machine],
        errors: {},
        loaded: true,
        loading: false,
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("StatusColumn")).toMatchSnapshot();
  });

  describe("status text", () => {
    it("displays the machine's status if not deploying or deployed", () => {
      machine.status = NodeStatus.NEW;
      machine.status_code = nodeStatus.NEW;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='status-text']").text()).toBe("New");
    });

    it("displays the short-form of Ubuntu release if deployed", () => {
      machine.status = NodeStatus.DEPLOYED;
      machine.status_code = nodeStatus.DEPLOYED;
      machine.osystem = "ubuntu";
      machine.distro_series = "bionic";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='status-text']").text()).toBe(
        "Ubuntu 18.04 LTS"
      );
    });

    it("displays the full OS and release if non-Ubuntu deployed", () => {
      machine.status = NodeStatus.DEPLOYED;
      machine.status_code = nodeStatus.DEPLOYED;
      machine.osystem = "centos";
      machine.distro_series = "centos70";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='status-text']").text()).toBe("CentOS 7");
    });

    it("displays 'Deploying OS release' if machine is deploying", () => {
      machine.status = NodeStatus.DEPLOYING;
      machine.status_code = nodeStatus.DEPLOYING;
      machine.osystem = "ubuntu";
      machine.distro_series = "bionic";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='status-text']").text()).toBe(
        "Deploying Ubuntu 18.04 LTS"
      );
    });

    it("displays an error message for broken machines", () => {
      machine.error_description = "machine is on fire";
      machine.status = NodeStatus.BROKEN;
      machine.status_code = nodeStatus.BROKEN;
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='error-text']").text()).toBe(
        "machine is on fire"
      );
    });
  });

  describe("progress text", () => {
    it("displays the machine's status_message if in a transient state", () => {
      machine.status = NodeStatus.TESTING;
      machine.status_code = nodeStatus.TESTING;
      machine.status_message = "2 of 6 tests complete";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='progress-text']").text()).toBe(
        "2 of 6 tests complete"
      );
    });

    it(`does not display the machine's status_message if
      not in a transient state`, () => {
      machine.status = NodeStatus.ALLOCATED;
      machine.status_code = nodeStatus.ALLOCATED;
      machine.status_message = "This machine is allocated";
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find("[data-test='progress-text']").text()).toBe("");
    });
  });

  describe("status icon", () => {
    it("shows a spinner if machine is in a transient state", () => {
      machine.status = NodeStatus.COMMISSIONING;
      machine.status_code = nodeStatus.COMMISSIONING;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find(".p-icon--spinner").exists()).toBe(true);
    });

    it(`shows a warning and tooltip if machine has failed tests and is not in a
      state where the warning should be hidden`, () => {
      machine.status = NodeStatus.ALLOCATED;
      machine.status_code = nodeStatus.ALLOCATED;
      machine.testing_status.status = scriptStatus.FAILED as TestResult;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machines", key: "testKey" }]}
          >
            <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find(".p-icon--warning").exists()).toBe(true);
      expect(wrapper.find("Tooltip").exists()).toBe(true);
    });
  });

  it("can show a menu with all possible options", () => {
    machine.actions = [
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
          <StatusColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu so the elements get rendered.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find(".p-contextual-menu__dropdown")).toMatchSnapshot();
  });

  it("does not render table menu if onToggleMenu not provided", () => {
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

    expect(wrapper.find("TableMenu").exists()).toBe(false);
  });
});
