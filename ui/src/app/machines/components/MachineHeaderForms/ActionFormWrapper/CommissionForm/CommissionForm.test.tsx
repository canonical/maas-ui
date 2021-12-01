import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import CommissionForm from "./CommissionForm";

import type { RootState } from "app/store/root/types";
import { ScriptType } from "app/store/script/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  script as scriptFactory,
  scriptState as scriptStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("CommissionForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        }),
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
            name: "custom-commissioning-script",
            tags: ["node"],
            script_type: ScriptType.COMMISSIONING,
          }),
        ],
      }),
    });
  });

  it("fetches scripts if they haven't been loaded yet", () => {
    state.script.loaded = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CommissionForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "script/fetch")
    ).toBe(true);
  });

  it("correctly dispatches actions to commission given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CommissionForm
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
        enableSSH: true,
        skipBMCConfig: true,
        skipNetworking: true,
        skipStorage: true,
        updateFirmware: true,
        configureHBA: true,
        testingScripts: [state.script.items[0]],
        commissioningScripts: [state.script.items[1]],
        scriptInputs: { testingScript0: { url: "www.url.com" } },
      })
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "machine/commission")
    ).toStrictEqual([
      {
        type: "machine/commission",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.COMMISSION,
            extra: {
              enable_ssh: true,
              skip_bmc_config: true,
              skip_networking: true,
              skip_storage: true,
              commissioning_scripts: [
                state.script.items[1].id,
                "update_firmware",
                "configure_hba",
              ],
              testing_scripts: [state.script.items[0].id],
              script_input: { testingScript0: { url: "www.url.com" } },
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/commission",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.COMMISSION,
            extra: {
              enable_ssh: true,
              skip_bmc_config: true,
              skip_networking: true,
              skip_storage: true,
              commissioning_scripts: [
                state.script.items[1].id,
                "update_firmware",
                "configure_hba",
              ],
              testing_scripts: [state.script.items[0].id],
              script_input: { testingScript0: { url: "www.url.com" } },
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });
});
