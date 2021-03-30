import { mount } from "enzyme";
import * as fileDownload from "js-file-download";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DownloadMenu from "./DownloadMenu";

import FileContext, { fileContextStore } from "app/base/file-context";
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
        items: [
          machineDetailsFactory({
            fqdn: "hungry-wombat.aus",
            system_id: "abc123",
          }),
        ],
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
            combined: "installation-output log",
          }),
        },
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("is disabled if there are no downloads", () => {
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
    expect(wrapper.find("ContextualMenu").prop("toggleDisabled")).toBe(true);
  });

  it("does not display a YAML output item when it does not exist", () => {
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
        .some((link) => link["data-test"] === "machine-output-yaml")
    ).toBe(false);
  });

  it("can display a YAML output item", () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test yaml file");
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FileContext.Provider value={fileContextStore}>
            <DownloadMenu systemId="abc123" />
          </FileContext.Provider>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("ContextualMenu")
        .prop("links")
        .some((link) => link["data-test"] === "machine-output-yaml")
    ).toBe(true);
  });

  it("generates a download when the installation item is clicked", () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test yaml file");
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2021-03-25").getTime());
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
      .find((link) => link["data-test"] === "machine-output-yaml")
      .onClick();
    expect(downloadSpy).toHaveBeenCalledWith(
      "test yaml file",
      "hungry-wombat.aus-machine-output-2021-03-25.yaml"
    );
  });

  it("does not display a XML output item when it does not exist", () => {
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
        .some((link) => link["data-test"] === "machine-output-xml")
    ).toBe(false);
  });

  it("can display a XML output item", () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test xml file");
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FileContext.Provider value={fileContextStore}>
            <DownloadMenu systemId="abc123" />
          </FileContext.Provider>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("ContextualMenu")
        .prop("links")
        .some((link) => link["data-test"] === "machine-output-xml")
    ).toBe(true);
  });

  it("generates a download when the installation item is clicked", () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test xml file");
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2021-03-25").getTime());
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
      .find((link) => link["data-test"] === "machine-output-xml")
      .onClick();
    expect(downloadSpy).toHaveBeenCalledWith(
      "test xml file",
      "hungry-wombat.aus-machine-output-2021-03-25.xml"
    );
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
        .some((link) => link["data-test"] === "installation-output")
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
        .some((link) => link["data-test"] === "installation-output")
    ).toBe(true);
  });

  it("generates a download when the installation item is clicked", () => {
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2021-03-25").getTime());
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
      .find((link) => link["data-test"] === "installation-output")
      .onClick();
    expect(downloadSpy).toHaveBeenCalledWith(
      "installation-output log",
      "hungry-wombat.aus-installation-output-2021-03-25.log"
    );
  });
});
