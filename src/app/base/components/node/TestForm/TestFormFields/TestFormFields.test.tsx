import TestForm from "../TestForm";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { ScriptType } from "app/store/script/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  scriptState as scriptStateFactory,
  script as scriptFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

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

  it("displays a field for URL if a selected script has url parameter", async () => {
    renderWithBrowserRouter(
      <TestForm
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={state.machine.items}
        onTest={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines/add", state }
    );
    expect(screen.queryByTestId("url-script-input")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("textbox", { name: "Tests" }));
    await userEvent.click(
      screen.getByRole("option", { name: "internet-connectivity" })
    );
    expect(screen.getByTestId("url-script-input")).toBeInTheDocument();
  });
});
