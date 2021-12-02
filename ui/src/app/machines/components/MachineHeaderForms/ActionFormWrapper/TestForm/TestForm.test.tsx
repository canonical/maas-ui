import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TestForm from "./TestForm";

import { HardwareType } from "app/base/enum";
import type { RootState } from "app/store/root/types";
import { ScriptType } from "app/store/script/types";
import type { Script } from "app/store/script/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  script as scriptFactory,
  scriptState as scriptStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

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

  it("dispatches actions to test given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TestForm
            clearHeaderContent={jest.fn()}
            machines={state.machine.items}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        enableSSH: true,
        scripts: state.script.items,
        scriptInputs: {
          "internet-connectivity": "https://connectivity-check.ubuntu.com",
        },
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "machine/test")
    ).toStrictEqual([
      {
        type: "machine/test",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.TEST,
            extra: {
              enable_ssh: true,
              testing_scripts: state.script.items.map((script) => script.id),
              script_input: {
                "internet-connectivity":
                  "https://connectivity-check.ubuntu.com",
              },
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/test",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.TEST,
            extra: {
              enable_ssh: true,
              testing_scripts: state.script.items.map((script) => script.id),
              script_input: {
                "internet-connectivity":
                  "https://connectivity-check.ubuntu.com",
              },
            },
            system_id: "def456",
          },
        },
      },
    ]);
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TestForm
            clearHeaderContent={jest.fn()}
            hardwareType={HardwareType.Network}
            machines={state.machine.items}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    // An equality assertion can't be made here as preselected scripts have
    // a 'displayName' added
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TestForm
            applyConfiguredNetworking={true}
            clearHeaderContent={jest.fn()}
            machines={state.machine.items}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    // An equality assertion can't be made here as preselected scripts have
    // a 'displayName' added
    const preselected: Script[] = wrapper
      .find("TestFormFields")
      .prop("preselected");
    expect(preselected[0].id).toEqual(scripts[0].id);
    expect(preselected[1].id).toEqual(scripts[2].id);
    expect(preselected.length).toEqual(2);
  });
});
