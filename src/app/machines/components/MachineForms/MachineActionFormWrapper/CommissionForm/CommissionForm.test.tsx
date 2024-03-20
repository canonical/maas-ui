import configureStore from "redux-mock-store";

import CommissionForm from "./CommissionForm";

import { actions as machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import { ScriptName, ScriptType } from "@/app/store/script/types";
import { PowerState } from "@/app/store/types/enum";
import { NodeStatusCode } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("CommissionForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({ system_id: "abc123" }),
          factory.machine({ system_id: "def456" }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
          def456: factory.machineStatus(),
        }),
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
            name: "custom-commissioning-script",
            tags: ["node"],
            script_type: ScriptType.COMMISSIONING,
          }),
          factory.script({
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
        clearSidePanelContent={vi.fn()}
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
        clearSidePanelContent={vi.fn()}
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
        clearSidePanelContent={vi.fn()}
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

  it("Displays an error notification if power type is not set and status is unknown", () => {
    state.machine.items[0].power_state = PowerState.UNKNOWN;
    state.machine.items[0].status_code = NodeStatusCode.NEW;

    const store = mockStore(state);
    renderWithBrowserRouter(
      <CommissionForm
        clearSidePanelContent={vi.fn()}
        processingCount={0}
        viewingDetails={false}
      />,
      {
        route: "/machine/abc123",
        store,
        routePattern: "/machine/:id",
      }
    );

    expect(
      screen.getByRole("heading", {
        name: /error/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/unconfigured power type*/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /configure the power type/i,
      })
    ).toBeInTheDocument();
  });
});
