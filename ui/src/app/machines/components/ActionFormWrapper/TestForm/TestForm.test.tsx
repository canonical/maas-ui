import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import TestForm from "./TestForm";
import { HardwareType } from "app/base/enum";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  scripts as scriptsFactory,
  machineActionsState as machineActionsStateFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  scriptsState as scriptsStateFactory,
} from "testing/factories";
import { ScriptType } from "testing/factories/scripts";
import { Scripts } from "app/store/scripts/types";
import { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("TestForm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data: [{ name: "test", sentence: "test" }],
        }),
      }),
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
      scripts: scriptsStateFactory({
        loaded: true,
        items: [
          scriptsFactory({
            name: "smartctl-validate",
            tags: ["commissioning", "storage"],
            parameters: {
              storage: {
                argument_format: "{path}",
                type: "storage",
              },
            },
            type: 2,
          }),
          scriptsFactory({
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
            type: 2,
          }),
        ],
      }),
    });
  });

  it("dispatches actions to test selected machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TestForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          enableSSH: true,
          scripts: state.scripts.items,
          scriptInputs: {
            "internet-connectivity": "https://connectivity-check.ubuntu.com",
          },
        })
    );
    expect(
      store.getActions().filter((action) => action.type === "TEST_MACHINE")
    ).toStrictEqual([
      {
        type: "TEST_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "test",
            extra: {
              enable_ssh: true,
              testing_scripts: state.scripts.items.map((script) => script.id),
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
        type: "TEST_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "test",
            extra: {
              enable_ssh: true,
              testing_scripts: state.scripts.items.map((script) => script.id),
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

  it.only("prepopulates scripts of a given hardwareType", () => {
    const state = { ...initialState };
    const networkScript = scriptsFactory({
      hardware_type: HardwareType.Network,
      type: ScriptType.Testing,
    });

    state.scripts.items = [
      networkScript,
      scriptsFactory({
        hardware_type: HardwareType.Cpu,
        type: ScriptType.Testing,
      }),
      scriptsFactory({
        hardware_type: HardwareType.Memory,
        type: ScriptType.Testing,
      }),
    ];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TestForm
            setSelectedAction={jest.fn()}
            hardwareType={HardwareType.Network}
          />
        </MemoryRouter>
      </Provider>
    );

    // An equality assertion can't be made here as preselected scripts have
    // a 'displayName' added
    const preselected: Scripts[] = wrapper
      .find("TestFormFields")
      .prop("preselected");
    expect(preselected[0].id).toEqual(networkScript.id);
    expect(preselected.length).toEqual(1);
  });

  it("dispatches an action to test machine from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <TestForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          enableSSH: true,
          scripts: state.scripts.items,
          scriptInputs: {
            "internet-connectivity": "https://connectivity-check.ubuntu.com",
          },
        })
    );
    expect(
      store.getActions().filter((action) => action.type === "TEST_MACHINE")
    ).toStrictEqual([
      {
        type: "TEST_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "test",
            extra: {
              enable_ssh: true,
              testing_scripts: state.scripts.items.map((script) => script.id),
              script_input: {
                "internet-connectivity":
                  "https://connectivity-check.ubuntu.com",
              },
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });
});
