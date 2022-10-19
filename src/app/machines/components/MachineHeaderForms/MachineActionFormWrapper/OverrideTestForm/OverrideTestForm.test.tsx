import reduxToolkit from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import OverrideTestForm from "./OverrideTestForm";

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
import { renderWithBrowserRouter } from "testing/utils";

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

  it(`displays failed tests warning without suppress tests checkbox for a single
    machine with no failed tests`, () => {
    state.scriptresult.items = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <OverrideTestForm
        clearHeaderContent={jest.fn()}
        selectedCount={1}
        selectedMachines={{
          items: state.machine.items.map((item) => item.system_id),
        }}
        viewingDetails={true}
      />,
      { wrapperProps: { store }, route: "/machines" }
    );

    expect(screen.getByTestId("failed-results-message")).toHaveTextContent(
      "Machine host1 has not failed any tests. This can occur if the test suite failed to start."
    );
    expect(
      screen.queryByLabelText(/Suppress test-failure/)
    ).not.toBeInTheDocument();
  });

  it(`displays failed tests warning without suppress tests checkbox for multiple
    machines with no failed tests`, () => {
    state.scriptresult.items = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <OverrideTestForm
        clearHeaderContent={jest.fn()}
        selectedCount={1}
        selectedMachines={{
          items: state.machine.items.map((item) => item.system_id),
        }}
        viewingDetails={true}
      />,
      { wrapperProps: { store }, route: "/machines" }
    );

    expect(screen.getByTestId("failed-results-message")).toHaveTextContent(
      "Machine host1 has not failed any tests. This can occur if the test suite failed to start."
    );
    expect(
      screen.queryByLabelText(/Suppress test-failure/)
    ).not.toBeInTheDocument();
  });

  it("displays message with link for a single machine with failed tests", () => {
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
      { wrapperProps: { store }, route: "/machines" }
    );

    expect(screen.getByTestId("failed-results-message")).toHaveTextContent(
      "Machine host1 has failed 1 test."
    );
    expect(screen.getByRole("link", { name: /failed 1 test/ })).toHaveAttribute(
      "href",
      "/machine/abc123"
    );
  });

  // TODO: allow suppressing results for multiple machines via filter once the API supports it https://github.com/canonical/app-tribe/issues/1427
  it.skip("displays message for multiple machines with failed tests", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              selectedMachines={{
                items: state.machine.items.map((item) => item.system_id),
              }}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('[data-testid-id="failed-results-message"]').text()
    ).toBe("2 machines have failed 2 tests.");
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
      { wrapperProps: { store }, route: "/machines" }
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
            extra: {},
            filter: { id: ["abc123", "def456"] },
            system_id: undefined,
          },
        },
      },
    ]);
  });

  it("dispatches actions to fetch script results", async () => {
    state.scriptresult.items = [];
    state.nodescriptresult.items = {};
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
      { wrapperProps: { store }, route: "/machines" }
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
            extra: {},
            filter: { id: ["abc123"] },
            system_id: undefined,
          },
        },
      },
    ]);
    expect(
      store
        .getActions()
        .filter((action) => action.type === "scriptresult/getByNodeId").length
    ).toBe(1);
  });

  it("does not dispatch actions once script results have been requested", async () => {
    state.nodescriptresult.items = { abc123: [1] };
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
      { wrapperProps: { store }, route: "/machines" }
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Override failed tests/i })
    );
    const origionalDispatches = store
      .getActions()
      .filter((action) => action.type === "scriptresult/getByNodeId").length;
    expect(origionalDispatches).toBe(1);
    act(() => {
      // Fire a fake action so that the useEffect runs again.
      store.dispatch({ type: "" });
    });
    // There should not be any new dispatches.
    expect(
      store
        .getActions()
        .filter((action) => action.type === "scriptresult/getByNodeId").length
    ).toBe(origionalDispatches);
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
      { wrapperProps: { store }, route: "/machines" }
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Override failed tests/i })
    );
    await userEvent.click(screen.getByLabelText(/Suppress test-failure/));
    await userEvent.click(
      screen.getByRole("button", { name: /Override failed tests/i })
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "machine/suppressScriptResults")
    ).toStrictEqual([
      {
        meta: {
          method: "set_script_result_suppressed",
          model: "machine",
        },
        payload: {
          params: {
            script_result_ids: [1],
            system_id: "abc123",
          },
        },
        type: "machine/suppressScriptResults",
      },
    ]);
  });
});
