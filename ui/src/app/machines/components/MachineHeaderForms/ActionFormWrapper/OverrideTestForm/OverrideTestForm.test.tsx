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
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("OverrideTestForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              machines={[state.machine.items[0]]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('[data-testid-id="failed-results-message"]').text()
    ).toBe(
      "Machine host1 has not failed any tests. This can occur if the test suite failed to start."
    );
    expect(wrapper.find('FormikField[name="suppressTests"]').exists()).toBe(
      false
    );
  });

  it(`displays failed tests warning without suppress tests checkbox for multiple
    machines with no failed tests`, () => {
    state.scriptresult.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              machines={state.machine.items}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('[data-testid-id="failed-results-message"]').text()
    ).toBe(
      "2 machines have not failed any tests. This can occur if the test suite failed to start."
    );
    expect(wrapper.find('FormikField[name="suppressTests"]').exists()).toBe(
      false
    );
  });

  it("displays message with link for a single machine with failed tests", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              machines={[state.machine.items[0]]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('[data-testid-id="failed-results-message"]').text()
    ).toBe("Machine host1 has failed 1 test.");
    expect(
      wrapper.find('[data-testid-id="failed-results-message"] a').props().href
    ).toBe("/machine/abc123");
  });

  it("displays message for multiple machines with failed tests", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              machines={state.machine.items}
              processingCount={0}
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

  it("dispatches actions to override tests for given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              machines={state.machine.items}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        suppressResults: false,
      })
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "machine/overrideFailedTesting")
    ).toStrictEqual([
      {
        type: "machine/overrideFailedTesting",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.OVERRIDE_FAILED_TESTING,
            extra: {},
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/overrideFailedTesting",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.OVERRIDE_FAILED_TESTING,
            extra: {},
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("dispatches actions to fetch script results", () => {
    state.scriptresult.items = [];
    state.nodescriptresult.items = {};
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              machines={state.machine.items}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "scriptresult/getByNodeId").length
    ).toBe(2);
  });

  it("does not dispatch actions once script results have been requested", () => {
    state.nodescriptresult.items = { abc123: [1], def456: [2] };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              machines={state.machine.items}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const origionalDispatches = store
      .getActions()
      .filter((action) => action.type === "scriptresult/getByNodeId").length;
    expect(origionalDispatches).toBe(2);
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

  it("dispatches actions to suppress script results for given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <OverrideTestForm
              clearHeaderContent={jest.fn()}
              machines={state.machine.items}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        suppressResults: true,
      })
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
      {
        meta: {
          method: "set_script_result_suppressed",
          model: "machine",
        },
        payload: {
          params: {
            script_result_ids: [2],
            system_id: "def456",
          },
        },
        type: "machine/suppressScriptResults",
      },
    ]);
  });
});
