import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import InstallationOutput from "./InstallationOutput";

import { PowerState } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import type { ScriptResult } from "app/store/scriptresult/types";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "app/store/scriptresult/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultData as scriptResultDataFactory,
  scriptResultState as scriptResultStateFactory,
  nodeScriptResultState as nodeScriptResultStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("InstallationOutput", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1] },
      }),
      scriptresult: scriptResultStateFactory({
        items: [
          scriptResultFactory({
            id: 1,
            result_type: ScriptResultType.INSTALLATION,
          }),
        ],
        logs: {
          1: scriptResultDataFactory({
            combined: "Installation output",
          }),
        },
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
    state.scriptresult.logs = {};
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

  it("displays the state when there is no result", () => {
    state.scriptresult.items = [];
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "No installation result found."
    );
  });

  it("displays the state when the machine is off", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.PENDING;
    state.machine.items[0].power_state = PowerState.OFF;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "System is off."
    );
  });

  it("displays the state when the machine is booting", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.PENDING;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "System is booting..."
    );
  });

  it("displays the state when the machine is installing", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.RUNNING;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Installation has begun!"
    );
  });

  it("displays the state when the machine has installed but no result", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.PASSED;
    delete state.scriptresult.logs["1"].combined;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Installation has succeeded but no output was given."
    );
  });

  it("can display the installation log", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.PASSED;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Installation output"
    );
  });

  it("displays the state when the installation failed without result", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.FAILED;
    delete state.scriptresult.logs["1"].combined;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Installation has failed and no output was given."
    );
  });

  it("displays the log when the installation failed", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.FAILED;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Installation output"
    );
  });

  it("displays the state when the installation timed out", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.TIMEDOUT;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Installation failed after 40 minutes."
    );
  });

  it("displays the state when the installation was aborted", () => {
    state.scriptresult.items[0].status = ScriptResultStatus.ABORTED;
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Installation was aborted."
    );
  });

  it("displays the state the installation status is unknown", () => {
    state.scriptresult.items = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.INSTALLATION,
        status: "huh???",
      } as Partial<ScriptResult> & { status: string }),
    ];
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
    expect(wrapper.find("CodeSnippet").prop("blocks")[0].code).toBe(
      "Unknown log status huh???"
    );
  });
});
