import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import OverrideTestForm from "./OverrideTestForm";

const mockStore = configureStore();

describe("OverrideTestForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      general: {
        machineActions: {
          data: [
            { name: "override-failed-testing", sentence: "change those pools" },
          ],
        },
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          { hostname: "host1", system_id: "abc123" },
          { hostname: "host2", system_id: "def456" },
        ],
        selected: [],
        statuses: {
          abc123: { settingPool: false },
          def456: { settingPool: false },
        },
      },
      scriptresults: {
        errors: {},
        loading: false,
        loaded: true,
        items: {
          abc123: [
            {
              id: 1,
              name: "script1",
            },
            {
              id: 2,
              name: "script2",
            },
          ],
        },
      },
    };
  });

  it(`displays failed tests warning without suppress tests checkbox for a single
    machine with no failed tests`, () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123"];
    state.scriptresults.items = {};
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
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
    state.scriptresults.items = {};
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
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
          <OverrideTestForm
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test-id="failed-results-message"]').text()).toBe(
      "Machine host1 has failed 2 tests."
    );
    expect(
      wrapper.find('[data-test-id="failed-results-message"] a').props().href
    ).toBe(
      `${process.env.REACT_APP_BASENAME}${process.env.REACT_APP_ANGULAR_BASENAME}/machine/abc123`
    );
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
          <OverrideTestForm
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
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
          <OverrideTestForm
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        suprressResults: false,
      })
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "MACHINE_OVERRIDE_FAILED_TESTING")
    ).toStrictEqual([
      {
        type: "MACHINE_OVERRIDE_FAILED_TESTING",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "override-failed-testing",
            extra: {},
            system_id: "abc123",
          },
        },
      },
      {
        type: "MACHINE_OVERRIDE_FAILED_TESTING",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "override-failed-testing",
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
          <OverrideTestForm
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
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
        .filter((action) => action.type === "SET_SCRIPT_RESULT_SUPPRESSED")
    ).toStrictEqual([
      {
        meta: {
          method: "set_script_result_suppressed",
          model: "machine",
        },
        payload: {
          params: {
            script_result_ids: [1, 2],
            system_id: "abc123",
          },
        },
        type: "SET_SCRIPT_RESULT_SUPPRESSED",
      },
    ]);
  });

  it("can render when processing machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    state.machine.statuses.abc123 = { overridingFailedTesting: true };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm
            processing={true}
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="loading-label"]').text()).toBe(
      "Overriding failed tests for 1 of 2 machines..."
    );
  });

  it("can set the processing state when successfully submitting", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const setProcessing = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <OverrideTestForm
            setProcessing={setProcessing}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        suppressResults: true,
      })
    );
    expect(setProcessing).toHaveBeenCalledWith(true);
  });
});
