import * as reduxToolkit from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";

import OverrideTestForm from "./OverrideTestForm";

import { machineActions } from "@/app/store/machine";
import type { FetchFilters } from "@/app/store/machine/types";
import { FetchGroupKey } from "@/app/store/machine/types";
import { selectedToFilters } from "@/app/store/machine/utils";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "@/app/store/scriptresult/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();

vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});

describe("OverrideTestForm", () => {
  let state: RootState;

  beforeEach(() => {
    vi.spyOn(query, "generateCallId").mockReturnValue("123456");
    vi.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        details: factory.machineStateDetails({
          "123456": factory.machineStateDetailsItem({
            system_id: "abc123",
          }),
        }),
        items: [
          factory.machine({ hostname: "host1", system_id: "abc123" }),
          factory.machine({ hostname: "host2", system_id: "def456" }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
          def456: factory.machineStatus(),
        }),
      }),
      nodescriptresult: factory.nodeScriptResultState({
        items: { abc123: [1], def456: [2] },
      }),
      scriptresult: factory.scriptResultState({
        loaded: true,
        loading: false,
        items: [
          factory.scriptResult({
            status: ScriptResultStatus.FAILED,
            id: 1,
            result_type: ScriptResultType.TESTING,
            results: [
              factory.scriptResultResult({
                name: "script1",
              }),
              factory.scriptResultResult({
                name: "script2",
              }),
            ],
          }),
          factory.scriptResult({
            status: ScriptResultStatus.FAILED,
            id: 2,
            result_type: ScriptResultType.TESTING,
            results: [factory.scriptResultResult()],
          }),
        ],
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dispatches actions to override tests for given machines", async () => {
    const store = mockStore(state);

    renderWithBrowserRouter(
      <OverrideTestForm
        clearSidePanelContent={vi.fn()}
        selectedCount={1}
        selectedMachines={{
          items: state.machine.items.map((item) => item.system_id),
        }}
        viewingDetails={false}
      />,
      { store, route: "/machines" }
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Override failed tests/i })
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "machine/overrideFailedTesting")
    ).toStrictEqual([
      {
        type: "machine/overrideFailedTesting",
        meta: {
          callId: "123456",
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.OVERRIDE_FAILED_TESTING,
            extra: {
              suppress_failed_script_results: false,
            },
            filter: { id: ["abc123", "def456"] },
            system_id: undefined,
          },
        },
      },
    ]);
  });

  it("dispatches actions to suppress script results for given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <OverrideTestForm
        clearSidePanelContent={vi.fn()}
        selectedCount={1}
        selectedMachines={{
          items: [state.machine.items[0].system_id],
        }}
        viewingDetails={false}
      />,
      { store, route: "/machines" }
    );

    await userEvent.click(screen.getByLabelText(/Suppress test-failure/));
    await userEvent.click(
      screen.getByRole("button", { name: /Override failed tests/i })
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "machine/overrideFailedTesting")
    ).toStrictEqual([
      machineActions.overrideFailedTesting(
        {
          filter: { id: ["abc123"] },
          suppress_failed_script_results: true,
        },
        "123456"
      ),
    ]);
  });

  it("dispatches actions to suppress script results for given multiple machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <OverrideTestForm
        clearSidePanelContent={vi.fn()}
        selectedCount={1}
        selectedMachines={{
          items: ["abc123"],
          groups: ["admin"],
          grouping: FetchGroupKey.Owner,
        }}
        viewingDetails={false}
      />,
      { store, route: "/machines" }
    );

    await userEvent.click(screen.getByLabelText(/Suppress test-failure/));
    await userEvent.click(
      screen.getByRole("button", { name: /Override failed tests/i })
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "machine/overrideFailedTesting")
    ).toStrictEqual([
      machineActions.overrideFailedTesting(
        {
          filter: selectedToFilters({
            groups: ["admin"],
            grouping: FetchGroupKey.Owner,
          }) as FetchFilters,
          suppress_failed_script_results: true,
        },
        "123456"
      ),
      machineActions.overrideFailedTesting(
        {
          filter: selectedToFilters({
            items: ["abc123"],
          }) as FetchFilters,
          suppress_failed_script_results: true,
        },
        "123456"
      ),
    ]);
  });
});
