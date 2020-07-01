import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import DeployForm from "./DeployForm";

const mockStore = configureStore();

describe("DeployForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [
          {
            name: "default_osystem",
            value: "ubuntu",
            choices: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
          },
        ],
        errors: {},
        loaded: true,
        loading: false,
      },
      general: {
        defaultMinHweKernel: {
          data: "",
          errors: {},
          loaded: true,
          loading: false,
        },

        machineActions: {
          data: [{ name: "deploy", sentence: "deploy" }],
        },
        osInfo: {
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
          errors: {},
          loaded: true,
          loading: false,
        },
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
          },
          {
            system_id: "def456",
          },
        ],
        selected: [],
        statuses: {
          abc123: {},
          def456: {},
        },
      },
      user: {
        auth: {
          saved: false,
          user: {
            email: "test@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 1,
            username: "admin",
          },
        },
        errors: {},
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      },
    };
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
          <DeployForm setProcessing={jest.fn()} setSelectedAction={jest.fn()} />
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

  it("can show the status when processing machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    state.machine.statuses.abc123 = { deploying: true };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            processing={true}
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="loading-label"]').text()).toBe(
      "Starting deployment for 1 of 2 machines..."
    );
  });

  it("can set the processing state when successfully submitting", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const setProcessing = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            setProcessing={setProcessing}
            setSelectedAction={jest.fn()}
          />
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
    expect(setProcessing).toHaveBeenCalledWith(true);
  });
});
