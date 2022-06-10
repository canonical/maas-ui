import type { ReactWrapper } from "enzyme";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router";
import { CompatRouter } from "react-router-dom-v5-compat";

import TestActions from "./TestActions";

import * as hooks from "app/base/hooks/analytics";
import controllerURLs from "app/controllers/urls";
import machineURLs from "app/machines/urls";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "app/store/scriptresult/types";
import {
  controllerDetails as controllerDetailsFactory,
  machineDetails as machineDetailsFactory,
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
} from "testing/factories";

const openMenu = (wrapper: ReactWrapper) => {
  wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
};

describe("TestActions", () => {
  let mockSendAnalytics: jest.Mock;
  let mockUseSendAnalytics: jest.SpyInstance;

  beforeEach(() => {
    mockSendAnalytics = jest.fn();
    mockUseSendAnalytics = jest
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);
  });

  afterEach(() => {
    mockSendAnalytics.mockRestore();
    mockUseSendAnalytics.mockRestore();
  });

  it("can display an action to view machine commissioning script details", () => {
    const machine = machineDetailsFactory();
    const scriptResult = scriptResultFactory({
      status: ScriptResultStatus.PASSED,
    });
    const wrapper = mount(
      <MemoryRouter>
        <CompatRouter>
          <TestActions
            node={machine}
            resultType={ScriptResultType.COMMISSIONING}
            scriptResult={scriptResult}
            setExpanded={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    );

    openMenu(wrapper);
    expect(wrapper.find("Link[data-testid='view-details']").exists()).toBe(
      true
    );
    expect(wrapper.find("Link[data-testid='view-details']").prop("to")).toBe(
      machineURLs.machine.commissioning.scriptResult({
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
    const wrapper = mount(
      <MemoryRouter>
        <CompatRouter>
          <TestActions
            node={controller}
            resultType={ScriptResultType.COMMISSIONING}
            scriptResult={scriptResult}
            setExpanded={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    );

    openMenu(wrapper);
    expect(wrapper.find("Link[data-testid='view-details']").exists()).toBe(
      true
    );
    expect(wrapper.find("Link[data-testid='view-details']").prop("to")).toBe(
      controllerURLs.controller.commissioning.scriptResult({
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
    const wrapper = mount(
      <MemoryRouter>
        <CompatRouter>
          <TestActions
            node={machine}
            resultType={ScriptResultType.TESTING}
            scriptResult={scriptResult}
            setExpanded={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    );

    openMenu(wrapper);
    expect(wrapper.find("Link[data-testid='view-details']").exists()).toBe(
      true
    );
    expect(wrapper.find("Link[data-testid='view-details']").prop("to")).toBe(
      machineURLs.machine.testing.scriptResult({
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
    const wrapper = mount(
      <MemoryRouter>
        <CompatRouter>
          <TestActions
            node={machine}
            resultType={ScriptResultType.TESTING}
            scriptResult={scriptResult}
            setExpanded={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    );

    openMenu(wrapper);
    expect(wrapper.find("[data-testid='view-metrics']").exists()).toBe(true);
  });

  it("sends an analytics event when clicking the 'View previous tests' button", () => {
    const machine = machineDetailsFactory();
    const scriptResult = scriptResultFactory();
    const wrapper = mount(
      <MemoryRouter>
        <CompatRouter>
          <TestActions
            node={machine}
            resultType={ScriptResultType.TESTING}
            scriptResult={scriptResult}
            setExpanded={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    );

    openMenu(wrapper);
    wrapper.find("Button[data-testid='view-previous-tests']").simulate("click");

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
    const wrapper = mount(
      <MemoryRouter>
        <CompatRouter>
          <TestActions
            node={machine}
            resultType={ScriptResultType.TESTING}
            scriptResult={scriptResult}
            setExpanded={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    );

    openMenu(wrapper);
    wrapper.find("Button[data-testid='view-metrics']").simulate("click");

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine testing",
      "View testing script metrics",
      "View metrics",
    ]);
  });
});
