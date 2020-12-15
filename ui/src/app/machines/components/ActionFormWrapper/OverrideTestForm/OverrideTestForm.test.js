import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import OverrideTestForm from "./OverrideTestForm";
import { ResultType } from "app/base/enum";
import {
  generalState as generalStateFactory,
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

import { NodeActions } from "app/store/types/node";

const mockStore = configureStore();

describe("OverrideTestForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: {
          data: [
            {
              name: NodeActions.OVERRIDE_FAILED_TESTING,
              sentence: "change those pools",
            },
          ],
        },
      }),
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
        items: { abc123: [1, 2] },
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
        loading: false,
        items: [
          scriptResultFactory({
            exit_status: 1,
            id: 1,
            result_type: ResultType.Testing,
            results: [
              scriptResultResultFactory({
                id: 1,
                name: "script1",
              }),
              scriptResultResultFactory({
                id: 2,
                name: "script2",
              }),
            ],
          }),
        ],
      }),
    });
  });

  it(`displays failed tests warning without suppress tests checkbox for a single
    machine with no failed tests`, () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123"];
    state.scriptresult.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test-id="failed-results-message"]').text()).toBe(
      "Machine host1 has not failed any tests. This can occur if the test suite failed to start."
    );
    expect(wrapper.find('FormikField[name="suppressTests"]').exists()).toBe(
      false
    );
  });

  it(`displays failed tests warning without suppress tests checkbox for multiple
    machines with no failed tests`, () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    state.scriptresult.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test-id="failed-results-message"]').text()).toBe(
      "2 machines have not failed any tests. This can occur if the test suite failed to start."
    );
    expect(wrapper.find('FormikField[name="suppressTests"]').exists()).toBe(
      false
    );
  });

  it("displays message with link for a single machine with failed tests", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test-id="failed-results-message"]').text()).toBe(
      "Machine host1 has failed 2 tests."
    );
    expect(
      wrapper.find('[data-test-id="failed-results-message"] a').props().href
    ).toBe("/machine/abc123");
  });

  it("displays message for multiple machines with failed tests", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test-id="failed-results-message"]').text()).toBe(
      "2 machines have failed 2 tests."
    );
  });

  it("dispatches actions to override tests for selected machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
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

  it("dispatches actions to suppress script results for selected machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
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
    ]);
  });

  it(`correctly dispatches action to override failed testing of machine from
    details view`, () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <OverrideTestForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
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
    ]);
  });

  it(`correctly dispatches action to suppress test results of machine from
    details view`, () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <OverrideTestForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
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
    ]);
  });
});
