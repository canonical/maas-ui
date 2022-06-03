import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup";
import * as fileDownload from "js-file-download";

import DownloadMenu, { Label } from "./DownloadMenu";

import FileContext, { fileContextStore } from "app/base/file-context";
import { api } from "app/base/sagas/http";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  ScriptResultStatus,
  ScriptResultType,
  ScriptResultNames,
} from "app/store/scriptresult/types";
import { NodeStatus } from "app/store/types/node";
import {
  controllerState as controllerStateFactory,
  controllerDetails as controllerDetailsFactory,
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultData as scriptResultDataFactory,
  scriptResultState as scriptResultStateFactory,
  nodeScriptResultState as nodeScriptResultStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

jest.mock("js-file-download", () => jest.fn());

describe("DownloadMenu", () => {
  let state: RootState;
  let userEvt: UserEvent;
  let machine: MachineDetails;
  let controller: ControllerDetails;

  beforeEach(() => {
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2021-03-25").getTime());
    // Work around for RTL async events with fake timers.
    userEvt = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    machine = machineDetailsFactory({
      fqdn: "hungry-wombat.aus",
      system_id: "abc123",
    });
    controller = controllerDetailsFactory({
      fqdn: "hungry-wombat.aus",
      system_id: "abc123",
    });
    state = rootStateFactory({
      controller: controllerStateFactory({
        items: [controller],
      }),
      machine: machineStateFactory({
        items: [machine],
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1] },
      }),
      scriptresult: scriptResultStateFactory({
        items: [
          scriptResultFactory({
            id: 1,
            name: ScriptResultNames.INSTALL_LOG,
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
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("is disabled if there are no downloads", () => {
    state.scriptresult.logs = {};
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    expect(screen.getByRole("button", { name: Label.Toggle })).toBeDisabled();
  });

  it("does not display a YAML output item when it does not exist", async () => {
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.queryByRole("button", { name: "Machine output (YAML)" })
    ).not.toBeInTheDocument();
  });

  it("can display a YAML output item", async () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test yaml file");
    renderWithMockStore(
      <FileContext.Provider value={fileContextStore}>
        <DownloadMenu node={machine} />
      </FileContext.Provider>,
      {
        state,
      }
    );
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.getByRole("button", { name: "Machine output (YAML)" })
    ).toBeInTheDocument();
  });

  it("generates a download when the installation item is clicked", async () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test yaml file");
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2021-03-25").getTime());
    const downloadSpy = jest.spyOn(fileDownload, "default");
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    await userEvt.click(
      screen.getByRole("button", { name: "Machine output (YAML)" })
    );
    expect(downloadSpy).toHaveBeenCalledWith(
      "test yaml file",
      "hungry-wombat.aus-machine-output-2021-03-25.yaml"
    );
  });

  it("does not display a XML output item when it does not exist", async () => {
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.queryByRole("button", { name: "Machine output (XML)" })
    ).not.toBeInTheDocument();
  });

  it("can display a XML output item", async () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test xml file");
    renderWithMockStore(
      <FileContext.Provider value={fileContextStore}>
        <DownloadMenu node={machine} />
      </FileContext.Provider>,
      {
        state,
      }
    );
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.getByRole("button", { name: "Machine output (XML)" })
    ).toBeInTheDocument();
  });

  it("generates a download when the installation item is clicked for a machine", async () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test xml file");
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2021-03-25").getTime());
    const downloadSpy = jest.spyOn(fileDownload, "default");
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    await userEvt.click(
      screen.getByRole("button", { name: "Machine output (XML)" })
    );
    expect(downloadSpy).toHaveBeenCalledWith(
      "test xml file",
      "hungry-wombat.aus-machine-output-2021-03-25.xml"
    );
  });

  it("generates a download when the installation item is clicked for a controller", async () => {
    jest.spyOn(fileContextStore, "get").mockReturnValue("test xml file");
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2021-03-25").getTime());
    const downloadSpy = jest.spyOn(fileDownload, "default");
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    await userEvt.click(
      screen.getByRole("button", { name: "Machine output (XML)" })
    );
    expect(downloadSpy).toHaveBeenCalledWith(
      "test xml file",
      "hungry-wombat.aus-machine-output-2021-03-25.xml"
    );
  });

  it("does not display an installation output item when there is no log", async () => {
    state.scriptresult.logs = {};
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.queryByRole("button", { name: Label.InstallationOutput })
    ).not.toBeInTheDocument();
  });

  it("can display an installation output item", async () => {
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.getByRole("button", { name: Label.InstallationOutput })
    ).toBeInTheDocument();
  });

  it("generates a download when the installation item is clicked", async () => {
    const downloadSpy = jest.spyOn(fileDownload, "default");
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    await userEvt.click(
      screen.getByRole("button", { name: Label.InstallationOutput })
    );
    expect(downloadSpy).toHaveBeenCalledWith(
      "installation-output log",
      "hungry-wombat.aus-installation-output-2021-03-25.log"
    );
  });

  it("does not display curtin logs item when there is no file", async () => {
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.queryByRole("button", { name: Label.CurtinLogs })
    ).not.toBeInTheDocument();
  });

  it("can display an curtin logs item for a failed deployment", async () => {
    state.machine.items[0].status = NodeStatus.FAILED_DEPLOYMENT;
    state.nodescriptresult.items.abc123.push(2);
    state.scriptresult.items.push(
      scriptResultFactory({
        id: 2,
        name: ScriptResultNames.CURTIN_LOG,
        result_type: ScriptResultType.INSTALLATION,
        status: ScriptResultStatus.PASSED,
      })
    );
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.getByRole("button", { name: Label.CurtinLogs })
    ).toBeInTheDocument();
  });

  it("does not display a curtin logs item for other statuses", async () => {
    state.machine.items[0].status = NodeStatus.FAILED_COMMISSIONING;
    state.nodescriptresult.items.abc123.push(2);
    state.scriptresult.items.push(
      scriptResultFactory({
        id: 2,
        name: ScriptResultNames.CURTIN_LOG,
        result_type: ScriptResultType.INSTALLATION,
        status: ScriptResultStatus.PASSED,
      })
    );
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    expect(
      screen.queryByRole("button", { name: Label.CurtinLogs })
    ).not.toBeInTheDocument();
  });

  it("generates a download when the curtin logs item is clicked", async () => {
    state.machine.items[0].status = NodeStatus.FAILED_DEPLOYMENT;
    state.nodescriptresult.items.abc123.push(2);
    state.scriptresult.items.push(
      scriptResultFactory({
        id: 2,
        name: ScriptResultNames.CURTIN_LOG,
        result_type: ScriptResultType.INSTALLATION,
        status: ScriptResultStatus.PASSED,
      })
    );
    jest
      .spyOn(api.scriptresults, "getCurtinLogsTar")
      .mockResolvedValue("curtin-logs-blob");
    const downloadSpy = jest.spyOn(fileDownload, "default");
    renderWithMockStore(<DownloadMenu node={machine} />, {
      state,
    });
    // Open the menu:
    await userEvt.click(screen.getByRole("button", { name: Label.Toggle }));
    await userEvt.click(screen.getByRole("button", { name: Label.CurtinLogs }));
    await Promise.resolve();
    expect(downloadSpy).toHaveBeenCalledWith(
      "curtin-logs-blob",
      "hungry-wombat.aus-curtin-2021-03-25.tar"
    );
  });
});
