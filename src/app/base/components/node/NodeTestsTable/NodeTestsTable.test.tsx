import type { Mock, SpyInstance } from "vitest";

import NodeTestsTable from "./NodeTestsTable";

import * as hooks from "@/app/base/hooks/analytics";
import type { ControllerDetails } from "@/app/store/controller/types";
import type { MachineDetails } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "@/app/store/scriptresult/types";
import * as factory from "@/testing/factories";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "@/testing/utils";

describe("NodeTestsTable", () => {
  let controller: ControllerDetails;
  let machine: MachineDetails;
  let state: RootState;
  let mockSendAnalytics: Mock;
  let mockUseSendAnalytics: SpyInstance;

  beforeEach(() => {
    machine = factory.machineDetails({
      locked: false,
      permissions: ["edit"],
    });
    controller = factory.controllerDetails({
      permissions: ["edit"],
    });
    state = factory.rootState({
      controller: factory.controllerState({
        loaded: true,
        items: [controller],
      }),
      machine: factory.machineState({
        loaded: true,
        items: [machine],
      }),
      scriptresult: factory.scriptResultState({
        loaded: true,
      }),
    });
    mockSendAnalytics = vi.fn();
    mockUseSendAnalytics = vi
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
      factory.scriptResult({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithProviders(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { state }
    );

    expect(screen.getByTestId("suppress-script-results")).toBeInTheDocument();
  });

  it("does not show a suppress column if node is a machine and there are no testing script results", () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      factory.scriptResult({
        id: 1,
        result_type: ScriptResultType.COMMISSIONING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithProviders(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { state }
    );

    expect(
      screen.queryByTestId("suppress-script-results")
    ).not.toBeInTheDocument();
  });

  it("does not show a suppress column if node is a controller", () => {
    state.nodescriptresult.items = { [controller.system_id]: [1] };
    const scriptResults = [
      factory.scriptResult({
        id: 1,
        result_type: ScriptResultType.COMMISSIONING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithProviders(
      <NodeTestsTable node={controller} scriptResults={scriptResults} />,
      { state }
    );

    expect(
      screen.queryByTestId("suppress-script-results")
    ).not.toBeInTheDocument();
  });

  it("disables suppress checkbox if test did not fail", async () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      factory.scriptResult({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.PASSED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithProviders(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { state }
    );

    const checkbox = screen.getByTestId("suppress-script-results");
    expect(checkbox).toBeDisabled();
    await userEvent.hover(checkbox);
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        "Only failed testing scripts can be suppressed."
      );
    });
  });

  it("dispatches suppress for an unsuppressed script result", async () => {
    state.nodescriptresult.items = { [machine.system_id]: [1] };
    const scriptResults = [
      factory.scriptResult({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;

    const { store } = renderWithProviders(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { state }
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
      factory.scriptResult({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: true,
      }),
    ];
    state.scriptresult.items = scriptResults;

    const { store } = renderWithProviders(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { state }
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
      factory.scriptResult({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithProviders(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { state }
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
      factory.scriptResult({
        id: 1,
        result_type: ScriptResultType.TESTING,
        status: ScriptResultStatus.FAILED,
        suppressed: true,
      }),
    ];
    state.scriptresult.items = scriptResults;
    renderWithProviders(
      <NodeTestsTable node={machine} scriptResults={scriptResults} />,
      { state }
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

  it("displays a message when there is no script result", () => {
    renderWithProviders(<NodeTestsTable node={machine} scriptResults={[]} />, {
      state,
    });

    expect(screen.getByText("No results available.")).toBeInTheDocument();
  });
});
