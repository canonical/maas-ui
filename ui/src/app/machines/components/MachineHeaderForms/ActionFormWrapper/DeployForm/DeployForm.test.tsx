import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeployForm from "./DeployForm";

import * as hooks from "app/base/hooks/analytics";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  config as configFactory,
  configState as configStateFactory,
  defaultMinHweKernelState as defaultMinHweKerelStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DeployForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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
        defaultMinHweKernel: defaultMinHweKerelStateFactory({
          data: "ga-18.04",
          loaded: true,
        }),
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
          loaded: true,
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

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "general/fetchDefaultMinHweKernel",
      "general/fetchOsInfo",
    ];

    expectedActions.forEach((expectedAction) => {
      expect(
        store.getActions().some((action) => action.type === expectedAction)
      );
    });
  });

  it("shows a spinner if data has not loaded yet", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: false,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-deploy-data']").exists()).toBe(
      true
    );
    expect(wrapper.find("form").exists()).toBe(false);
  });

  it("correctly dispatches actions to deploy given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={state.machine.items}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        oSystem: "ubuntu",
        release: "bionic",
        kernel: "",
        vmHostType: "",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "machine/deploy")
    ).toStrictEqual([
      {
        type: "machine/deploy",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.DEPLOY,
            extra: {
              osystem: "ubuntu",
              distro_series: "bionic",
              hwe_kernel: "",
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/deploy",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.DEPLOY,
            extra: {
              osystem: "ubuntu",
              distro_series: "bionic",
              hwe_kernel: "",
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("can deploy with user-data", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        includeUserData: true,
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        userData: "test script",
        vmHostType: "",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "machine/deploy")
    ).toStrictEqual([
      {
        type: "machine/deploy",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.DEPLOY,
            extra: {
              osystem: "ubuntu",
              distro_series: "bionic",
              hwe_kernel: "",
              user_data: "test script",
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("ignores enable_hw_sync if checkbox is not checked", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        includeUserData: false,
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        userData: "",
        vmHostType: "",
        enableHwSync: false,
      })
    );
    expect(
      store.getActions().find((action) => action.type === "machine/deploy")
        .payload.params.extra
    ).toStrictEqual({
      osystem: "ubuntu",
      distro_series: "bionic",
      hwe_kernel: "",
    });
  });

  it("adds enable_hw_sync if checkbox is checked", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        includeUserData: false,
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        userData: "",
        vmHostType: "",
        enableHwSync: true,
      })
    );
    expect(
      store.getActions().find((action) => action.type === "machine/deploy")
        .payload.params.extra
    ).toStrictEqual({
      osystem: "ubuntu",
      distro_series: "bionic",
      hwe_kernel: "",
      enable_hw_sync: true,
    });
  });

  it("ignores user-data if the cloud-init option is not checked", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        includeUserData: false,
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        userData: "",
        vmHostType: "",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "machine/deploy")
    ).toStrictEqual([
      {
        type: "machine/deploy",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.DEPLOY,
            extra: {
              osystem: "ubuntu",
              distro_series: "bionic",
              hwe_kernel: "",
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("sends an analytics event with cloud-init user data set", () => {
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = jest
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        includeUserData: true,
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        userData: "test script",
        vmHostType: "",
      })
    );

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine list deploy form",
      "Has cloud-init config",
      "Cloud-init user data",
    ]);
    mockUseSendAnalytics.mockRestore();
  });

  it("can register a LXD KVM host", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        vmHostType: PodType.LXD,
      })
    );
    const action = store
      .getActions()
      .find((action) => action.type === "machine/deploy");
    expect(action?.payload?.params?.extra?.register_vmhost).toBe(true);
    expect(action?.payload?.params?.extra?.install_kvm).toBeUndefined();
  });

  it("can register a libvirt KVM host", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        kernel: "",
        oSystem: "ubuntu",
        release: "bionic",
        vmHostType: PodType.VIRSH,
      })
    );
    const action = store
      .getActions()
      .find((action) => action.type === "machine/deploy");
    expect(action?.payload?.params?.extra?.install_kvm).toBe(true);
    expect(action?.payload?.params?.extra?.register_vmhost).toBeUndefined();
  });
});
