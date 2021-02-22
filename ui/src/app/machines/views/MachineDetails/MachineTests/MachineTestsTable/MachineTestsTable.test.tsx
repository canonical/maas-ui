import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import MachineTestsTable from ".";

import { ResultType, scriptStatus } from "app/base/enum";
import * as hooks from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineTestsTable", () => {
  let state: RootState;
  let mockSendAnalytics: jest.Mock;
  let mockUseSendAnalytics: jest.Mock;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
      }),
    });
    mockSendAnalytics = jest.fn();
    mockUseSendAnalytics = hooks.useSendAnalytics = jest.fn(
      () => mockSendAnalytics
    );
  });

  afterEach(() => {
    mockSendAnalytics.mockRestore();
    mockUseSendAnalytics.mockRestore();
  });

  it("shows a suppress column if there are testing script results", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Testing,
        status: scriptStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('input[data-test="suppress-script-results"]').exists()
    ).toBe(true);
  });

  it("does not show a suppress column if there are no testing script results", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Commissioning,
        status: scriptStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('input[data-test="suppress-script-results"]').exists()
    ).toBe(false);
  });

  it("disables suppress checkbox if test did not fail", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Testing,
        status: scriptStatus.PASSED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .find('input[data-test="suppress-script-results"]')
        .prop("disabled")
    ).toBe(true);
    expect(wrapper.find('[data-test="suppress-tooltip"]').prop("message")).toBe(
      "Only failed testing scripts can be suppressed."
    );
  });

  it("dispatches suppress for an unsuppressed script result", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Testing,
        status: scriptStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find('input[data-test="suppress-script-results"]');
    expect(checkbox.props().checked).toEqual(false);

    const event = { target: { value: "checked" } };
    checkbox.simulate("change", event);
    expect(
      store
        .getActions()
        .some((action) => action.type === "machine/suppressScriptResults")
    );
  });

  it("dispatches unsuppress for an suppressed script result", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Testing,
        status: scriptStatus.FAILED,
        suppressed: true,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find('input[data-test="suppress-script-results"]');
    expect(checkbox.props().checked).toEqual(true);

    const event = { target: { value: "checked" } };
    checkbox.simulate("change", event);
    expect(
      store
        .getActions()
        .some((action) => action.type === "machine/unsuppressScriptResults")
    );
  });

  it("sends an analytics event when suppressing a script result", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Testing,
        status: scriptStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find('input[data-test="suppress-script-results"]');
    checkbox.simulate("change", { target: { value: "checked" } });

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "Suppress script result failure",
      "Suppress",
    ]);
  });

  it("sends an analytics event when unsuppressing a script result", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Testing,
        status: scriptStatus.FAILED,
        suppressed: true,
      }),
    ];
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find('input[data-test="suppress-script-results"]');
    checkbox.simulate("change", { target: { value: "" } });

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "Unsuppress script result failure",
      "Unsuppress",
    ]);
  });
});
