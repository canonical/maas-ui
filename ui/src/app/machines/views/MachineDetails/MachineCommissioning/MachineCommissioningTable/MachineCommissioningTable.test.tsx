import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import MachineCommissioningTable from ".";

import * as hooks from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  partialScriptResult as partialScriptResultFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineCommissioningTable", () => {
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
          <MachineCommissioningTable scriptResults={scriptResults} />
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
          <MachineCommissioningTable scriptResults={scriptResults} />
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
          <MachineCommissioningTable scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("Button[data-test='action-menu-show-previous']").exists()
    ).toEqual(false);
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
          <MachineCommissioningTable scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("Button[data-test='action-menu-show-metrics']").exists()
    ).toEqual(false);
  });

  it("sends an analytics event when clicking the 'View previous tests' button", () => {
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
          <MachineCommissioningTable scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper
      .find("Button[data-test='action-menu-show-previous']")
      .simulate("click");

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine commissioning",
      "View commissioning script history",
      "View previous tests",
    ]);
  });
});
