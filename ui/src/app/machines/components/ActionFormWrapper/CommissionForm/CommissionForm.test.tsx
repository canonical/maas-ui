import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import CommissionForm from "./CommissionForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineAction as machineActionFactory,
  machineActionsState as machineActionsStateFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  scripts as scriptsFactory,
  scriptsState as scriptsStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CommissionForm", () => {
  let initialState: RootState;
  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data: [
            machineActionFactory({
              name: NodeActions.COMMISSION,
              title: "Commission",
            }),
          ],
        }),
      }),
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
            name: "custom-commissioning-script",
            tags: ["node"],
            type: 0,
          }),
        ],
      }),
    });
  });

  it("fetches scripts if they haven't been loaded yet", () => {
    const state = { ...initialState };
    state.scripts.loaded = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CommissionForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "FETCH_SCRIPTS")
    ).toBe(true);
  });

  it("does not fetch scripts if they've already been loaded", () => {
    const state = { ...initialState };
    state.scripts.loaded = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CommissionForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "FETCH_SCRIPTS")
    ).toBe(false);
  });

  it("correctly dispatches actions to commission selected machines in machine list", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CommissionForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          enableSSH: true,
          skipBMCConfig: true,
          skipNetworking: true,
          skipStorage: true,
          updateFirmware: true,
          configureHBA: true,
          testingScripts: [state.scripts.items[0]],
          commissioningScripts: [state.scripts.items[1]],
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
                state.scripts.items[1].id,
                "update_firmware",
                "configure_hba",
              ],
              testing_scripts: [state.scripts.items[0].id],
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
                state.scripts.items[1].id,
                "update_firmware",
                "configure_hba",
              ],
              testing_scripts: [state.scripts.items[0].id],
              script_input: { testingScript0: { url: "www.url.com" } },
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("correctly dispatches action to commission machine from details view", () => {
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
            component={() => <CommissionForm setSelectedAction={jest.fn()} />}
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
          skipBMCConfig: true,
          skipNetworking: true,
          skipStorage: true,
          updateFirmware: true,
          configureHBA: true,
          testingScripts: [state.scripts.items[0]],
          commissioningScripts: [state.scripts.items[1]],
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
                state.scripts.items[1].id,
                "update_firmware",
                "configure_hba",
              ],
              testing_scripts: [state.scripts.items[0].id],
              script_input: { testingScript0: { url: "www.url.com" } },
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });
});
