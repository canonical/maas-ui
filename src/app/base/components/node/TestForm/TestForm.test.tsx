import configureStore from "redux-mock-store";

import TestForm from "./TestForm";

import { HardwareType } from "@/app/base/enum";
import { machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import { ScriptType } from "@/app/store/script/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("TestForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({ system_id: "abc123" }),
          factory.machine({ system_id: "def456" }),
        ],
        statuses: {
          abc123: factory.machineStatus(),
          def456: factory.machineStatus(),
        },
      }),
      script: factory.scriptState({
        loaded: true,
        items: [
          factory.script({
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
          factory.script({
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

  it("calls the action to test given machines", async () => {
    // load only the internet connectivity script
    const script = state.script.items[1];
    state.script.items = [state.script.items[1]];
    const store = mockStore(state);
    const onTest = vi.fn();
    renderWithBrowserRouter(
      <TestForm
        cleanup={machineActions.cleanup}
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={state.machine.items}
        onTest={onTest}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Allow SSH access and prevent machine powering off",
      })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Tests" }),
      "internet-connectivity"
    );
    await userEvent.click(
      screen.getByRole("option", { name: "internet-connectivity" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Start tests for 2 machines" })
    );

    const expectedParameters = {
      enableSSH: true,
      scripts: [
        {
          ...script,
          displayName:
            "internet-connectivity (internet, network-validation, network)",
        },
      ],
      scriptInputs: {
        "internet-connectivity": {
          url: "https://connectivity-check.ubuntu.com",
        },
      },
    };

    expect(onTest).toHaveBeenNthCalledWith(1, {
      ...expectedParameters,
      systemId: "abc123",
    });
    expect(onTest).toHaveBeenNthCalledWith(2, {
      ...expectedParameters,
      systemId: "def456",
    });
  });

  it("prepopulates scripts of a given hardwareType", () => {
    const networkScript = factory.script({
      name: "test1",
      hardware_type: HardwareType.Network,
      script_type: ScriptType.TESTING,
    });

    state.script.items = [
      networkScript,
      factory.script({
        name: "test2",
        hardware_type: HardwareType.CPU,
        script_type: ScriptType.TESTING,
      }),
      factory.script({
        name: "test3",
        hardware_type: HardwareType.Memory,
        script_type: ScriptType.TESTING,
      }),
    ];

    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestForm
        cleanup={machineActions.cleanup}
        clearSidePanelContent={vi.fn()}
        hardwareType={HardwareType.Network}
        modelName="machine"
        nodes={state.machine.items}
        onTest={vi.fn()}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    expect(screen.getByRole("button", { name: "test1" })).toHaveAttribute(
      "data-testid",
      "selected-tag"
    );
  });

  it("prepopulates scripts with apply_configured_networking", () => {
    const scripts = [
      factory.script({
        name: "test1",
        apply_configured_networking: true,
        script_type: ScriptType.TESTING,
      }),
      factory.script({
        name: "test2",
        apply_configured_networking: false,
        script_type: ScriptType.TESTING,
      }),
      factory.script({
        name: "test3",
        apply_configured_networking: true,
        script_type: ScriptType.TESTING,
      }),
    ];
    state.script.items = scripts;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestForm
        applyConfiguredNetworking={true}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={state.machine.items}
        onTest={vi.fn()}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    expect(screen.getByRole("button", { name: "test1" })).toHaveAttribute(
      "data-testid",
      "selected-tag"
    );
  });
});
