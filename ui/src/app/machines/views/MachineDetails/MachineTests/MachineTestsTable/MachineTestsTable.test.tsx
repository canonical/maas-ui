import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import MachineTestsTable from ".";

import { ResultType, scriptStatus } from "app/base/enum";
import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  partialScriptResult as partialScriptResultFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineTestsTable", () => {
  let state: RootState;
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
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable
            machineId="abc123"
            scriptResults={[scriptResultFactory(), scriptResultFactory()]}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
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

  it("displays an action item to view history for script results with history", () => {
    const scriptResults = [scriptResultFactory({ id: 1 })];
    const scriptResultState = scriptResultStateFactory({
      history: { 1: [partialScriptResultFactory()] },
    });
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    state.scriptresult = scriptResultState;

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

    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(
      wrapper.find("Button[data-test='action-menu-show-previous']").exists()
    ).toEqual(true);
  });

  it("displays script results with history when clicking the show history action button", () => {
    const scriptResults = [scriptResultFactory({ id: 1 })];
    const scriptResultState = scriptResultStateFactory({
      history: { 1: [partialScriptResultFactory()] },
    });
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    state.scriptresult = scriptResultState;

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
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper
      .find("Button[data-test='action-menu-show-previous']")
      .simulate("click");

    expect(
      wrapper.find("tr[data-test='script-result-history']").exists()
    ).toEqual(true);
  });

  it("does not display an action item to view history for script results without history", () => {
    const scriptResults = [scriptResultFactory({ id: 1 })];
    const scriptResultState = scriptResultStateFactory({});
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    state.scriptresult = scriptResultState;

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
      wrapper.find("Button[data-test='action-menu-show-previous']").exists()
    ).toEqual(false);
  });

  it("displays metrics when clicking the show metrics action button", () => {
    const metrics = scriptResultResultFactory({
      title: "test-title",
      value: "test-value",
    });
    const scriptResults = [scriptResultFactory({ id: 1, results: [metrics] })];

    state.nodescriptresult.items = { abc123: [1] };
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
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper
      .find("Button[data-test='action-menu-show-metrics']")
      .simulate("click");

    expect(
      wrapper.find("tr[data-test='script-result-metrics']").exists()
    ).toEqual(true);
    expect(
      wrapper.find("tr[data-test='script-result-metrics'] td").at(0).text()
    ).toEqual("test-title");
    expect(
      wrapper.find("tr[data-test='script-result-metrics'] td").at(1).text()
    ).toEqual("test-value");
  });

  it("does not display an action item to view metrics for script results without metrics", () => {
    const scriptResults = [scriptResultFactory({ id: 1 })];
    const scriptResultState = scriptResultStateFactory({
      items: scriptResults,
    });
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult = scriptResultState;

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
      wrapper.find("Button[data-test='action-menu-show-metrics']").exists()
    ).toEqual(false);
  });
});
