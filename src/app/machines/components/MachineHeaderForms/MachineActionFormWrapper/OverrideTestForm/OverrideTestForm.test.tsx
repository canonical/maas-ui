import reduxToolkit from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import OverrideTestForm from "./OverrideTestForm";

import { actions as machineActions } from "app/store/machine";
import type { FetchFilters } from "app/store/machine/types";
import { FetchGroupKey } from "app/store/machine/types";
import { selectedToFilters } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "app/store/scriptresult/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeScriptResultState as nodeScriptResultStateFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
  machineStateDetails as machineStateDetailsFactory,
  machineStateDetailsItem as machineStateDetailsItemFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("OverrideTestForm", () => {
  let state: RootState;

  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        details: machineStateDetailsFactory({
          "123456": machineStateDetailsItemFactory({
            system_id: "abc123",
          }),
        }),
        items: [
          machineFactory({ hostname: "host1", system_id: "abc123" }),
          machineFactory({ hostname: "host2", system_id: "def456" }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        }),
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1], def456: [2] },
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
        loading: false,
        items: [
          scriptResultFactory({
            status: ScriptResultStatus.FAILED,
            id: 1,
            result_type: ScriptResultType.TESTING,
            results: [
              scriptResultResultFactory({
                name: "script1",
              }),
              scriptResultResultFactory({
                name: "script2",
              }),
            ],
          }),
          scriptResultFactory({
            status: ScriptResultStatus.FAILED,
            id: 2,
            result_type: ScriptResultType.TESTING,
            results: [scriptResultResultFactory()],
          }),
        ],
      }),
    });
  });

  it("dispatches actions to override tests for given machines", async () => {
    const store = mockStore(state);

    renderWithBrowserRouter(
      <OverrideTestForm
        clearHeaderContent={jest.fn()}
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
        clearHeaderContent={jest.fn()}
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
        clearHeaderContent={jest.fn()}
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
