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
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

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
          scriptFactory({
            name: "custom-testing-script",
            tags: ["node"],
            parameters: {
              url: {
                argument_format: "{url}",
                type: "url",
              },
            },
            script_type: ScriptType.TESTING,
          }),
        ],
      }),
    });
  });

  it("fetches scripts if they haven't been loaded yet", () => {
    state.script.loaded = false;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CommissionForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    expect(
      store.getActions().some((action) => action.type === "script/fetch")
    ).toBe(true);
  });

  it("correctly dispatches actions to commission given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CommissionForm
        clearSidePanelContent={jest.fn()}
        machines={state.machine.items}
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
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: `Skip configuring supported BMC controllers with a MAAS generated username and password`,
      })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Retain network configuration",
      })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Retain storage configuration",
      })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Update firmware",
      })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Configure HBA",
      })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Testing scripts" }),
      "custom"
    );
    await userEvent.click(screen.getByTestId("existing-tag"));

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "URL(s) to use for custom-testing-script script",
      }),
      "www.url.com"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Start commissioning/i })
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
        testing_scripts: [
          state.script.items[2].name,
          state.script.items[0].name,
        ],
        script_input: { "custom-testing-script": { url: "www.url.com" } },
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
        testing_scripts: [
          state.script.items[2].name,
          state.script.items[0].name,
        ],
        script_input: { "custom-testing-script": { url: "www.url.com" } },
      }),
    ]);
  });

  it("correctly dispatches an action to commission a machine without tests", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CommissionForm
        clearSidePanelContent={jest.fn()}
        machines={[state.machine.items[0]]}
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
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: `Skip configuring supported BMC controllers with a MAAS generated username and password`,
      })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Retain network configuration",
      })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Retain storage configuration",
      })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Update firmware",
      })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Configure HBA",
      })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "smartctl-validate" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Start commissioning/i })
    );

    expect(
      store.getActions().find((action) => action.type === "machine/commission")
        ?.payload.params.extra.testing_scripts
    ).toStrictEqual([ScriptName.NONE]);
  });
});
