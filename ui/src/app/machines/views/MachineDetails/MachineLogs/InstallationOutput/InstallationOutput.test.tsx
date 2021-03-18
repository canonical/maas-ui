import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import InstallationOutput from "./InstallationOutput";

import type { RootState } from "app/store/root/types";
import { ScriptResultType } from "app/store/scriptresult/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultData as scriptResultDataFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("InstallationOutput", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
      scriptresult: scriptResultStateFactory({
        items: [scriptResultFactory()],
      }),
    });
  });

  it("displays a spinner when the logs are loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <InstallationOutput systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("fetches the logs if they're not already loaded", () => {
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.INSTALLATION,
      }),
    ];
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <InstallationOutput systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some(({ type }) => type === "scriptresult/getLogs")
    ).toEqual(true);
  });

  it("can display the installation log", () => {
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.INSTALLATION,
      }),
    ];
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    state.scriptresult.logs = {
      1: scriptResultDataFactory({
        combined: "Installation output",
      }),
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <InstallationOutput systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("CodeSnippet").exists()).toBe(true);
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Installation output"
    );
  });
});
