import { screen } from "@testing-library/react";

import InstallationOutput, { Label } from "./InstallationOutput";

import type { RootState } from "app/store/root/types";
import type { ScriptResult } from "app/store/scriptresult/types";
import {
  ScriptResultNames,
  ScriptResultStatus,
  ScriptResultType,
} from "app/store/scriptresult/types";
import { PowerState } from "app/store/types/enum";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultData as scriptResultDataFactory,
  scriptResultState as scriptResultStateFactory,
  nodeScriptResultState as nodeScriptResultStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("InstallationOutput", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1] },
      }),
      scriptresult: scriptResultStateFactory({
        items: [
          scriptResultFactory({
            id: 1,
            name: ScriptResultNames.INSTALL_LOG,
            result_type: ScriptResultType.INSTALLATION,
          }),
        ],
        logs: {
          1: scriptResultDataFactory({
            combined: "script result",
          }),
        },
      }),
    });
  });

  it("displays a spinner when the logs are loading", () => {
    state.machine.items = [];
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
  });

  it("displays the state when there is no result", () => {
    state.scriptresult.items = [];
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText(Label.None)).toBeInTheDocument();
  });

  it("displays the state when the machine is off", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.PENDING;
    state.machine.items[0].power_state = PowerState.OFF;
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText(Label.Off)).toBeInTheDocument();
  });

  it("displays the state when the machine is booting", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.PENDING;
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText(Label.Booting)).toBeInTheDocument();
  });

  it("displays the state when the machine is installing", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.RUNNING;
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText(Label.Begun)).toBeInTheDocument();
  });

  it("displays the state when the machine has installed but no result", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.PASSED;
    state.scriptresult.logs = {
      1: scriptResultDataFactory({
        combined: undefined,
      }),
    };
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText(Label.SucceededNoOutput)).toBeInTheDocument();
  });

  it("can display the installation log", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.PASSED;
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText("script result")).toBeInTheDocument();
  });

  it("displays the state when the installation failed without result", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.FAILED;
    state.scriptresult.logs = {
      1: scriptResultDataFactory({
        combined: undefined,
      }),
    };
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText(Label.FailedNoOutput)).toBeInTheDocument();
  });

  it("displays the log when the installation failed", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.FAILED;
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText("script result")).toBeInTheDocument();
  });

  it("displays the state when the installation timed out", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.TIMEDOUT;
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText(Label.Timeout)).toBeInTheDocument();
  });

  it("displays the state when the installation was aborted", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.ABORTED;
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText(Label.Aborted)).toBeInTheDocument();
  });

  it("displays the state the installation status is unknown", () => {
    state.scriptresult.items = [
      scriptResultFactory({
        id: 1,
        name: ScriptResultNames.INSTALL_LOG,
        result_type: ScriptResultType.INSTALLATION,
        status: "huh???",
      } as Partial<ScriptResult> & { status: string }),
    ];
    renderWithMockStore(<InstallationOutput systemId="abc123" />, {
      state,
    });
    expect(screen.getByText("Unknown log status huh???")).toBeInTheDocument();
  });
});
