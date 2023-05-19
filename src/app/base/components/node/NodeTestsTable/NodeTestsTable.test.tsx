import configureStore from "redux-mock-store";

import NodeTestsTable from "./NodeTestsTable";

import * as hooks from "app/base/hooks/analytics";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "app/store/scriptresult/types";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("NodeTestsTable", () => {
  let controller: ControllerDetails;
  let machine: MachineDetails;
  let state: RootState;
  let mockSendAnalytics: jest.Mock;
  let mockUseSendAnalytics: jest.SpyInstance;

  beforeEach(() => {
    machine = machineDetailsFactory({
      locked: false,
      permissions: ["edit"],
    });
    controller = controllerDetailsFactory({
      permissions: ["edit"],
    });
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [controller],
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [machine],
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
      }),
    });
    mockSendAnalytics = jest.fn();
    mockUseSendAnalytics = jest
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);
  });

  afterEach(() => {
    mockSendAnalytics.mockRestore();
    mockUseSendAnalytics.mockRestore();
  });

  it("shows a suppress column if node is a machine and there are testing script results", () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithBrowserRouter(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { route: "/machine/abc123", state }
    );

    expect(screen.getByTestId("suppress-script-results")).toBeInTheDocument();
  });

  it("does not show a suppress column if node is a machine and there are no testing script results", () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.COMMISSIONING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithBrowserRouter(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { route: "/machine/abc123", state }
    );

    expect(
      screen.queryByTestId("suppress-script-results")
    ).not.toBeInTheDocument();
  });

  it("does not show a suppress column if node is a controller", () => {
    state.nodescriptresult.items = { [controller.system_id]: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.COMMISSIONING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithBrowserRouter(
      <NodeTestsTable node={controller} scriptResults={scriptResults} />,
      { route: "/controller/abc123", state }
    );

    expect(
      screen.queryByTestId("suppress-script-results")
    ).not.toBeInTheDocument();
  });

  it("disables suppress checkbox if test did not fail", () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.PASSED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithBrowserRouter(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { route: "/machine/abc123", state }
    );

    expect(screen.getByTestId("suppress-script-results")).toBeDisabled();
    expect(
      screen.getByRole("tooltip", {
        name: "Only failed testing scripts can be suppressed.",
      })
    ).toBeInTheDocument();
  });

  it("dispatches suppress for an unsuppressed script result", async () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { route: "/machine/abc123", store }
    );

    const checkbox = screen.getByTestId("suppress-script-results");
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(
      store
        .getActions()
        .some((action) => action.type === "machine/suppressScriptResults")
    );
  });

  it("dispatches unsuppress for an suppressed script result", async () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: true,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { route: "/machine/abc123", store }
    );

    const checkbox = screen.getByTestId("suppress-script-results");
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(
      store
        .getActions()
        .some((action) => action.type === "machine/unsuppressScriptResults")
    );
  });

  it("sends an analytics event when suppressing a script result", async () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithBrowserRouter(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { route: "/machine/abc123", state }
    );

    const checkbox = screen.getByTestId("suppress-script-results");

    await userEvent.click(checkbox);

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "Suppress script result failure",
      "Suppress",
    ]);
  });

  it("sends an analytics event when unsuppressing a script result", async () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: true,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithBrowserRouter(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { route: "/machine/abc123", state }
    );

    const checkbox = screen.getByTestId("suppress-script-results");

    await userEvent.click(checkbox);

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "Unsuppress script result failure",
      "Unsuppress",
    ]);
  });
});
