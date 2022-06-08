import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
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

const mockStore = configureStore();

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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NodeTestsTable node={machine} scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('input[data-testid="suppress-script-results"]').exists()
    ).toBe(true);
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NodeTestsTable node={machine} scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('input[data-testid="suppress-script-results"]').exists()
    ).toBe(false);
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NodeTestsTable node={controller} scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('input[data-testid="suppress-script-results"]').exists()
    ).toBe(false);
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NodeTestsTable node={machine} scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .find('input[data-testid="suppress-script-results"]')
        .prop("disabled")
    ).toBe(true);
    expect(
      wrapper.find('[data-testid="suppress-tooltip"]').prop("message")
    ).toBe("Only failed testing scripts can be suppressed.");
  });

  it("dispatches suppress for an unsuppressed script result", () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NodeTestsTable node={machine} scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find(
      'input[data-testid="suppress-script-results"]'
    );
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NodeTestsTable node={machine} scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find(
      'input[data-testid="suppress-script-results"]'
    );
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NodeTestsTable node={machine} scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find(
      'input[data-testid="suppress-script-results"]'
    );
    checkbox.simulate("change", { target: { value: "checked" } });

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "Suppress script result failure",
      "Suppress",
    ]);
  });

  it("sends an analytics event when unsuppressing a script result", () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NodeTestsTable node={machine} scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find(
      'input[data-testid="suppress-script-results"]'
    );
    checkbox.simulate("change", { target: { value: "" } });

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "Unsuppress script result failure",
      "Unsuppress",
    ]);
  });
});
