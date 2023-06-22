import configureStore from "redux-mock-store";

import DeployForm from "./DeployForm";

import * as hooks from "app/base/hooks/analytics";
import { ConfigNames } from "app/store/config/types";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
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
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DeployForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.DEFAULT_OSYSTEM,
            value: "ubuntu",
            choices: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
          }),
          configFactory({
            name: ConfigNames.ENABLE_ANALYTICS,
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
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
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
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    expect(screen.getByTestId("loading-deploy-data")).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("correctly dispatches actions to deploy given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={state.machine.items}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      screen.getByRole("option", { name: "No minimum kernel" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Start deployment for 2 machines" })
    );

    expect(
      store.getActions().filter((action) => action.type === "machine/deploy")
    ).toStrictEqual([
      machineActions.deploy({
        distro_series: "bionic",
        hwe_kernel: "",
        osystem: "ubuntu",
        system_id: "abc123",
      }),
      machineActions.deploy({
        distro_series: "bionic",
        hwe_kernel: "",
        osystem: "ubuntu",
        system_id: "def456",
      }),
    ]);
  });

  it("can deploy with user-data", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      screen.getByRole("option", { name: "No minimum kernel" })
    );

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: /Cloud-init user-data…/i,
      })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Upload script" }),
      "test script"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Start deployment for machine" })
    );

    expect(
      store.getActions().filter((action) => action.type === "machine/deploy")
    ).toStrictEqual([
      machineActions.deploy({
        distro_series: "bionic",
        hwe_kernel: "",
        osystem: "ubuntu",
        system_id: "abc123",
        user_data: "test script",
      }),
    ]);
  });

  it("ignores enable_hw_sync if checkbox is not checked", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      screen.getByRole("option", { name: "No minimum kernel" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Start deployment for machine" })
    );

    expect(
      store.getActions().find((action) => action.type === "machine/deploy")
    ).toStrictEqual(
      machineActions.deploy({
        distro_series: "bionic",
        hwe_kernel: "",
        osystem: "ubuntu",
        system_id: "abc123",
      })
    );
  });

  it("adds enable_hw_sync if checkbox is checked", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      screen.getByRole("option", { name: "No minimum kernel" })
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: /Periodically sync hardware/i })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Start deployment for machine" })
    );
    expect(
      store.getActions().find((action) => action.type === "machine/deploy")
    ).toStrictEqual(
      machineActions.deploy({
        distro_series: "bionic",
        enable_hw_sync: true,
        hwe_kernel: "",
        osystem: "ubuntu",
        system_id: "abc123",
      })
    );
  });

  it("ignores user-data if the cloud-init option is not checked", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      screen.getByRole("option", { name: "No minimum kernel" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Start deployment for machine" })
    );
    expect(
      store.getActions().filter((action) => action.type === "machine/deploy")
    ).toStrictEqual([
      machineActions.deploy({
        distro_series: "bionic",
        hwe_kernel: "",
        osystem: "ubuntu",
        system_id: "abc123",
      }),
    ]);
  });

  it("sends an analytics event with cloud-init user data set", async () => {
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = jest
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      screen.getByRole("option", { name: "No minimum kernel" })
    );

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: /Cloud-init user-data…/i,
      })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Upload script" }),
      "test script"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Start deployment for machine" })
    );

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine list deploy form",
      "Has cloud-init config",
      "Cloud-init user data",
    ]);
    mockUseSendAnalytics.mockRestore();
  });

  it("can register a LXD KVM host", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      screen.getByRole("option", { name: "No minimum kernel" })
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: /Register as MAAS KVM host/i })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Start deployment for machine" })
    );

    const action = store
      .getActions()
      .find((action) => action.type === "machine/deploy");
    expect(action?.payload?.params?.extra?.register_vmhost).toBe(true);
    expect(action?.payload?.params?.extra?.install_kvm).toBeUndefined();
  });

  it("can register a libvirt KVM host", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeployForm
        clearSidePanelContent={jest.fn()}
        machines={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      screen.getByRole("option", { name: "No minimum kernel" })
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: /Register as MAAS KVM host/i })
    );

    await userEvent.click(screen.getByRole("radio", { name: /libvirt/i }));

    await userEvent.click(
      screen.getByRole("button", { name: "Start deployment for machine" })
    );
    const action = store
      .getActions()
      .find((action) => action.type === "machine/deploy");
    expect(action?.payload?.params?.extra?.install_kvm).toBe(true);
    expect(action?.payload?.params?.extra?.register_vmhost).toBeUndefined();
  });
});
