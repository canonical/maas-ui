import configureStore from "redux-mock-store";

import TestForm from "./TestForm";

import { HardwareType } from "app/base/enum";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { ScriptType } from "app/store/script/types";
import type { Script } from "app/store/script/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  script as scriptFactory,
  scriptState as scriptStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  submitFormikForm,
} from "testing/utils";

const mockStore = configureStore();

describe("TestForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      }),
      script: scriptStateFactory({
        loaded: true,
        items: [
          scriptFactory({
            name: "smartctl-validate",
            tags: ["commissioning", "storage"],
            parameters: {
              storage: {
                argument_format: "{path}",
                type: "storage",
              },
            },
            script_type: ScriptType.TESTING,
          }),
          scriptFactory({
            name: "internet-connectivity",
            tags: ["internet", "network-validation", "network"],
            parameters: {
              url: {
                default: "https://connectivity-check.ubuntu.com",
                description:
                  "A comma seperated list of URLs, IPs, or domains to test if the specified interface has access to. Any protocol supported by curl is support. If no protocol or icmp is given the URL will be pinged.",
                required: true,
              },
            },
            script_type: ScriptType.TESTING,
          }),
        ],
      }),
    });
  });

  it("calls the action to test given machines", () => {
    const store = mockStore(state);
    const onTest = jest.fn();
    renderWithBrowserRouter(
      <TestForm
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={state.machine.items}
        onTest={onTest}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    submitFormikForm(wrapper, {
      enableSSH: true,
      scripts: state.script.items,
      scriptInputs: {
        "internet-connectivity": "https://connectivity-check.ubuntu.com",
      },
    });

    expect(onTest).toHaveBeenCalledWith({
      enableSSH: true,
      scripts: state.script.items,
      scriptInputs: {
        "internet-connectivity": "https://connectivity-check.ubuntu.com",
      },
      systemId: "abc123",
    });
    expect(onTest).toHaveBeenCalledWith({
      enableSSH: true,
      scripts: state.script.items,
      scriptInputs: {
        "internet-connectivity": "https://connectivity-check.ubuntu.com",
      },
      systemId: "def456",
    });
  });

  it("prepopulates scripts of a given hardwareType", () => {
    const networkScript = scriptFactory({
      name: "test1",
      hardware_type: HardwareType.Network,
      script_type: ScriptType.TESTING,
    });

    state.script.items = [
      networkScript,
      scriptFactory({
        name: "test2",
        hardware_type: HardwareType.CPU,
        script_type: ScriptType.TESTING,
      }),
      scriptFactory({
        name: "test3",
        hardware_type: HardwareType.Memory,
        script_type: ScriptType.TESTING,
      }),
    ];

    const store = mockStore(state);
    const wrapper = renderWithBrowserRouter(
      <TestForm
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        hardwareType={HardwareType.Network}
        modelName="machine"
        nodes={state.machine.items}
        onTest={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    const preselected: Script[] = wrapper
      .find("TestFormFields")
      .prop("preselected");
    expect(preselected[0].id).toEqual(networkScript.id);
    expect(preselected.length).toEqual(1);
  });

  it("prepopulates scripts with apply_configured_networking", () => {
    const scripts = [
      scriptFactory({
        name: "test1",
        apply_configured_networking: true,
        script_type: ScriptType.TESTING,
      }),
      scriptFactory({
        name: "test2",
        apply_configured_networking: false,
        script_type: ScriptType.TESTING,
      }),
      scriptFactory({
        name: "test3",
        apply_configured_networking: true,
        script_type: ScriptType.TESTING,
      }),
    ];
    state.script.items = scripts;
    const store = mockStore(state);
    const wrapper = renderWithBrowserRouter(
      <TestForm
        applyConfiguredNetworking={true}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={state.machine.items}
        onTest={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    const preselected: Script[] = wrapper
      .find("TestFormFields")
      .prop("preselected");
    expect(preselected[0].id).toEqual(scripts[0].id);
    expect(preselected[1].id).toEqual(scripts[2].id);
    expect(preselected.length).toEqual(2);
  });
});
