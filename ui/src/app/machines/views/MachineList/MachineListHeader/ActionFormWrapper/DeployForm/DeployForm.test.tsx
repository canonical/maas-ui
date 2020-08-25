import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { sendAnalyticsEvent } from "analytics";
import DeployForm from "./DeployForm";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  generalState as generalStateFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
} from "testing/factories";

jest.mock("analytics", () => ({
  sendAnalyticsEvent: jest.fn(),
}));

const mockStore = configureStore();

describe("DeployForm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: "default_osystem",
            value: "ubuntu",
            choices: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
          }),
          configFactory({
            name: "enable_analytics",
            value: true,
          }),
        ],
      }),
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          data: {
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
              ["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"'],
            ],
            kernels: {
              ubuntu: {
                bionic: [
                  ["ga-18.04", "bionic (ga-18.04)"],
                  ["ga-18.04-lowlatency", "bionic (ga-18.04-lowlatency)"],
                  ["hwe-18.04", "bionic (hwe-18.04)"],
                  ["hwe-18.04-edge", "bionic (hwe-18.04-edge)"],
                  ["hwe-18.04-lowlatency", "bionic (hwe-18.04-lowlatency)"],
                  [
                    "hwe-18.04-lowlatency-edge",
                    "bionic (hwe-18.04-lowlatency-edge)",
                  ],
                ],
                focal: [
                  ["ga-20.04", "focal (ga-20.04)"],
                  ["ga-20.04-lowlatency", "focal (ga-20.04-lowlatency)"],
                ],
              },
            },
            default_osystem: "ubuntu",
            default_release: "bionic",
          },
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      }),
    });
  });

  afterEach(() => {
    sendAnalyticsEvent.mockClear();
  });

  it("correctly dispatches actions to deploy selected machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        oSystem: "ubuntu",
        release: "bionic",
        kernel: "",
        installKVM: false,
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "DEPLOY_MACHINE")
    ).toStrictEqual([
      {
        type: "DEPLOY_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "deploy",
            extra: {
              osystem: "ubuntu",
              distro_series: "bionic",
              hwe_kernel: "",
              install_kvm: false,
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "DEPLOY_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "deploy",
            extra: {
              osystem: "ubuntu",
              distro_series: "bionic",
              hwe_kernel: "",
              install_kvm: false,
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("can deploy with user-data", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        includeUserData: true,
        installKVM: false,
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        userData: "test script",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "DEPLOY_MACHINE")
    ).toStrictEqual([
      {
        type: "DEPLOY_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "deploy",
            extra: {
              osystem: "ubuntu",
              distro_series: "bionic",
              hwe_kernel: "",
              install_kvm: false,
              user_data: "test script",
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("ignores user-data if the cloud-init option is not checked", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        includeUserData: false,
        installKVM: false,
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        userData: "",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "DEPLOY_MACHINE")
    ).toStrictEqual([
      {
        type: "DEPLOY_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "deploy",
            extra: {
              osystem: "ubuntu",
              distro_series: "bionic",
              hwe_kernel: "",
              install_kvm: false,
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("sends an event if cloud-init is set", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        includeUserData: true,
        installKVM: false,
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        userData: "test script",
      })
    );
    expect(sendAnalyticsEvent).toHaveBeenCalled();
  });
});
