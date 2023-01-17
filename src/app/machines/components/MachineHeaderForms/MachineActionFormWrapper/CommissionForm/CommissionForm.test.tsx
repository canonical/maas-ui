import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import CommissionForm from "./CommissionForm";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { ScriptName, ScriptType } from "app/store/script/types";
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
          <CompatRouter>
            <CommissionForm
              clearSidePanelContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
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
          <CompatRouter>
            <CommissionForm
              clearSidePanelContent={jest.fn()}
              machines={state.machine.items}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
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
      machineActions.commission({
        system_id: "abc123",
        enable_ssh: true,
        skip_bmc_config: true,
        skip_networking: true,
        skip_storage: true,
        commissioning_scripts: [
          state.script.items[1].name,
          ScriptName.UPDATE_FIRMWARE,
          ScriptName.CONFIGURE_HBA,
        ],
        testing_scripts: [state.script.items[0].name],
        script_input: { testingScript0: { url: "www.url.com" } },
      }),
      machineActions.commission({
        system_id: "def456",
        enable_ssh: true,
        skip_bmc_config: true,
        skip_networking: true,
        skip_storage: true,
        commissioning_scripts: [
          state.script.items[1].name,
          ScriptName.UPDATE_FIRMWARE,
          ScriptName.CONFIGURE_HBA,
        ],
        testing_scripts: [state.script.items[0].name],
        script_input: { testingScript0: { url: "www.url.com" } },
      }),
    ]);
  });

  it("correctly dispatches an action to commission a machine without tests", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <CommissionForm
              clearSidePanelContent={jest.fn()}
              machines={[state.machine.items[0]]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
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
        testingScripts: [],
        commissioningScripts: [state.script.items[1]],
        scriptInputs: { testingScript0: { url: "www.url.com" } },
      })
    );

    expect(
      store.getActions().find((action) => action.type === "machine/commission")
        ?.payload.params.extra.testing_scripts
    ).toStrictEqual([ScriptName.NONE]);
  });
});
