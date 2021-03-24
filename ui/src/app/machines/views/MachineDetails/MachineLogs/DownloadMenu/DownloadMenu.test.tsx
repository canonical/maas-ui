import { mount } from "enzyme";
import * as fileDownload from "js-file-download";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DownloadMenu from "./DownloadMenu";

import type { RootState } from "app/store/root/types";
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

jest.mock("js-file-download", () => jest.fn());

describe("DownloadMenu", () => {
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
            status: ScriptResultStatus.PASSED,
          }),
        ],
        logs: {
          1: scriptResultDataFactory({
            combined: "Installation output log",
          }),
        },
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("does not display an installation output item when there is no log", () => {
    state.scriptresult.logs = {};
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DownloadMenu systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("ContextualMenu")
        .prop("links")
        .some(({ children }) => children === "Installation output")
    ).toBe(false);
  });

  it("can display an installation output item", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DownloadMenu systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("ContextualMenu")
        .prop("links")
        .some(({ children }) => children === "Installation output")
    ).toBe(true);
  });

  it("can generates a download when the installation item is clicked", () => {
    const downloadSpy = jest.spyOn(fileDownload, "default");
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DownloadMenu systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("ContextualMenu")
      .prop("links")
      .find(({ children }) => children === "Installation output")
      .onClick();
    expect(downloadSpy).toHaveBeenCalledWith(
      "Installation output log",
      "installation-output.txt"
    );
  });
});
