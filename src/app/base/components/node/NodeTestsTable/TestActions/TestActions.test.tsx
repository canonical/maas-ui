import TestActions from "./TestActions";

import urls from "app/base/urls";
import {
  controllerDetails as controllerDetailsFactory,
  machineDetails as machineDetailsFactory,
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const openMenu = () => {
  userEvent.click(screen.getByRole("button", { name: /actions menu/i }));
};

describe("TestActions", () => {
  let mockSendAnalytics: jest.Mock;

  beforeEach(() => {
    mockSendAnalytics = jest.fn();
    jest.spyOn(hooks, "useSendAnalytics").mockReturnValue(mockSendAnalytics);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can display an action to view machine commissioning script details", () => {
    const machine = machineDetailsFactory();
    const scriptResult = scriptResultFactory({
      status: ScriptResultStatus.PASSED,
    });
    render(
      <TestActions
        node={machine}
        resultType={ScriptResultType.COMMISSIONING}
        scriptResult={scriptResult}
        setExpanded={jest.fn()}
      />
    );

    openMenu();

    expect(screen.getByRole("link", { name: /view-details/i })).toHaveAttribute(
      "href",
      urls.machines.machine.commissioning.scriptResult({
        id: machine.system_id,
        scriptResultId: scriptResult.id,
      })
    );
  });

  it("can display an action to view controller commissioning script details", () => {
    const controller = controllerDetailsFactory();
    const scriptResult = scriptResultFactory({
      status: ScriptResultStatus.PASSED,
    });
    render(
      <TestActions
        node={controller}
        resultType={ScriptResultType.COMMISSIONING}
        scriptResult={scriptResult}
        setExpanded={jest.fn()}
      />
    );

    openMenu();
    expect(screen.getByRole("link", { name: /view-details/i })).toHaveAttribute(
      "href",
      urls.controller.controller.commissioning.scriptResult({
        id: controller.system_id,
        scriptResultId: scriptResult.id,
      })
    );
  });

  it("can display an action to view machine testing script details", () => {
    const machine = machineDetailsFactory();
    const scriptResult = scriptResultFactory({
      status: ScriptResultStatus.PASSED,
    });
    render(
      <TestActions
        node={machine}
        resultType={ScriptResultType.TESTING}
        scriptResult={scriptResult}
        setExpanded={jest.fn()}
      />
    );

    openMenu();
    expect(screen.getByRole("link", { name: /view-details/i })).toHaveAttribute(
      "href",
      urls.machines.machine.testing.scriptResult({
        id: machine.system_id,
        scriptResultId: scriptResult.id,
      })
    );
  });

  it("displays an action to view metrics if the test has its own results", () => {
    const machine = machineDetailsFactory();
    const scriptResult = scriptResultFactory({
      results: [scriptResultResultFactory()],
    });
    render(
      <TestActions
        node={machine}
        resultType={ScriptResultType.TESTING}
        scriptResult={scriptResult}
        setExpanded={jest.fn()}
      />
    );

    openMenu();
    expect(
      screen.getByRole("button", { name: /view metrics/i })
    ).toBeInTheDocument();
  });

  it("sends an analytics event when clicking the 'View previous tests' button", () => {
    const machine = machineDetailsFactory();
    const scriptResult = scriptResultFactory();
    render(
      <TestActions
        node={machine}
        resultType={ScriptResultType.TESTING}
        scriptResult={scriptResult}
        setExpanded={jest.fn()}
      />
    );

    openMenu();
    userEvent.click(
      screen.getByRole("button", { name: /view previous tests/i })
    );

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "View testing script history",
      "View previous tests",
    ]);
  });

  it("sends an analytics event when clicking the 'View metrics' button", () => {
    const machine = machineDetailsFactory();
    const scriptResult = scriptResultFactory();
    render(
      <TestActions
        node={machine}
        resultType={ScriptResultType.TESTING}
        scriptResult={scriptResult}
        setExpanded={jest.fn()}
      />
    );

    openMenu();
    userEvent.click(screen.getByRole("button", { name: /view metrics/i }));

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "View testing script metrics",
      "View metrics",
    ]);
  });
});
