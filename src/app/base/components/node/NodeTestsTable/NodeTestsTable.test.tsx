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
  waitForLoading,
  within,
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

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machineDetails({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
      scriptresult: factory.scriptResultState({
        loaded: true,
      }),
    });
  });

  afterEach(() => {
    mockSendAnalytics.mockRestore();
    mockUseSendAnalytics.mockRestore();
  });

  describe("display", () => {
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
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
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
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
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
          result_type: ScriptResultType.TESTING,
          status: ScriptResultStatus.FAILED,
          suppressed: false,
        }),
      ];
      state.scriptresult.items = scriptResults;
      renderWithProviders(
        <NodeTestsTable node={controller} scriptResults={scriptResults} />,
        {
          initialEntries: ["/controller/abc123"],
          state,
        }
      );

      expect(
        screen.queryByRole("columnheader", { name: "Suppress" })
      ).not.toBeInTheDocument();
    });

    it.each([
      { hasMetrics: true, icon: "success" },
      { hasMetrics: false, icon: "minus" },
    ])(
      "shows the $icon metrics indicator when hasMetrics is $hasMetrics",
      ({ hasMetrics, icon }) => {
        const scriptResult = factory.scriptResult({
          name: "script-name",
          results: hasMetrics ? [factory.scriptResultResult()] : [],
        });
        state.scriptresult.items = [scriptResult];

        renderWithProviders(
          <NodeTestsTable node={machine} scriptResults={[scriptResult]} />,
          { state }
        );

        const table = within(
          screen.getByRole("treegrid", { name: "Test results" })
        );
        const metricsIndex = table
          .getAllByRole("columnheader")
          .indexOf(table.getByRole("columnheader", { name: "Metrics" }));
        const row = table.getByRole("row", { name: /script-name/ });
        const metricsCell = within(row).getAllByRole("gridcell")[metricsIndex];

        // Icons have no accessible name; inspect the indicator in the Metrics cell.
        expect(
          within(metricsCell).getByText("", { selector: `.p-icon--${icon}` })
        ).toBeInTheDocument();
      }
    );

    it("displays a message when there is no script result", () => {
      renderWithProviders(
        <NodeTestsTable node={machine} scriptResults={[]} />,
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
      );

      expect(screen.getByText("No results available.")).toBeInTheDocument();
    });

    it("displays a test history table if test has been run more than once", async () => {
      const scriptResult = factory.scriptResult({ id: 1 });
      state.scriptresult.items = [scriptResult];
      state.scriptresult.history = {
        1: [factory.partialScriptResult(), factory.partialScriptResult()],
      };

      renderWithProviders(
        <NodeTestsTable node={machine} scriptResults={[scriptResult]} />,
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
      );
      await waitForLoading();

      const previousTestsButton = screen.getByTestId("view-history-link");
      await userEvent.click(previousTestsButton);

      expect(screen.queryByTestId("no-history")).not.toBeInTheDocument();
      expect(screen.getByTestId("view-history-link")).toBeInTheDocument();
    });

    it.each([
      {
        nodeType: "machine",
        resultType: ScriptResultType.COMMISSIONING,
        root: "scripts/commissioning",
      },
      {
        nodeType: "machine",
        resultType: ScriptResultType.DEPLOYMENT,
        root: "scripts/deployment",
      },
      {
        nodeType: "machine",
        resultType: ScriptResultType.TESTING,
        root: "scripts/tests",
      },
      {
        nodeType: "controller",
        resultType: ScriptResultType.COMMISSIONING,
        root: "commissioning",
      },
    ])(
      "links names and history logs to $nodeType/$root",
      async ({ nodeType, resultType, root }) => {
        const node = nodeType === "machine" ? machine : controller;
        const scriptResult = factory.scriptResult({
          id: 1,
          name: "script-name",
          result_type: resultType,
        });
        state.scriptresult.items = [scriptResult];
        state.scriptresult.history = {
          1: [factory.partialScriptResult({ id: 2 })],
        };

        renderWithProviders(
          <NodeTestsTable node={node} scriptResults={[scriptResult]} />,
          { state }
        );
        await waitForLoading();

        expect(
          screen.getByRole("link", { name: "script-name" })
        ).toHaveAttribute(
          "href",
          `/${nodeType}/${node.system_id}/${root}/1/details`
        );

        await userEvent.click(
          screen.getByRole("link", { name: "View history" })
        );

        expect(screen.getByRole("link", { name: "View log" })).toHaveAttribute(
          "href",
          `/${nodeType}/${node.system_id}/${root}/2/details`
        );
      }
    );

    it("displays a message if the test has no history", async () => {
      const scriptResult = factory.scriptResult({ id: 1 });
      state.scriptresult.items = [scriptResult];
      state.scriptresult.history = {
        1: [],
      };

      renderWithProviders(
        <NodeTestsTable node={machine} scriptResults={[scriptResult]} />,
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
      );
      await waitForLoading();

      const previousTestsButton = screen.getByTestId("view-history-link");
      await userEvent.click(previousTestsButton);

      expect(screen.getByTestId("no-history")).toBeInTheDocument();
    });
  });

  describe("actions", () => {
    it("shows historical rows when expanded and hides them when closed", async () => {
      const scriptResult = factory.scriptResult({ id: 1, name: "script-name" });
      state.scriptresult.items = [scriptResult];
      state.scriptresult.history = {
        1: [
          factory.partialScriptResult({ id: 1 }),
          factory.partialScriptResult({ id: 2 }),
          factory.partialScriptResult({ id: 3 }),
        ],
      };

      renderWithProviders(
        <NodeTestsTable node={machine} scriptResults={[scriptResult]} />,
        { state }
      );
      await waitForLoading();

      const table = within(
        screen.getByRole("treegrid", { name: "Test results" })
      );
      expect(table.getAllByRole("row")).toHaveLength(2);
      expect(
        table.queryByRole("link", { name: "View log" })
      ).not.toBeInTheDocument();

      await userEvent.click(table.getByRole("link", { name: "View history" }));

      expect(table.getAllByRole("row")).toHaveLength(4);
      expect(table.getAllByRole("link", { name: "View log" })).toHaveLength(2);

      await userEvent.click(screen.getByRole("button", { name: "Close" }));

      expect(table.getAllByRole("row")).toHaveLength(2);
      expect(
        table.queryByRole("link", { name: "View log" })
      ).not.toBeInTheDocument();
      expect(
        table.getByRole("link", { name: "script-name" })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Close" })
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
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
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
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
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
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
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
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
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
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
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

    it("fetches script result history on load", async () => {
      const scriptResult = factory.scriptResult({ id: 1 });
      const scriptResults = [scriptResult];
      state.scriptresult.items = [scriptResult];
      state.scriptresult.history = {
        1: [],
      };

      const { store } = renderWithProviders(
        <NodeTestsTable node={machine} scriptResults={scriptResults} />,
        {
          initialEntries: ["/machine/abc123"],
          state,
        }
      );

      await waitForLoading();
      const actions = store.getActions();

      expect(
        actions.find((action) => action.type === "scriptresult/getHistory")
      ).toStrictEqual({
        meta: {
          method: "get_history",
          model: "noderesult",
          nocache: true,
        },
        payload: {
          params: {
            id: 1,
          },
        },
        type: "scriptresult/getHistory",
      });
    });
  });
});
