import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerCommissioning from "./ControllerCommissioning";

import { HardwareType } from "app/base/enum";
import { actions as scriptResultActions } from "app/store/scriptresult";
import { ScriptResultType } from "app/store/scriptresult/types";
import { TestStatusStatus } from "app/store/types/node";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  nodeScriptResultState as nodeScriptResultStateFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

jest.mock("@canonical/react-components/dist/hooks", () => {
  const hooks = jest.requireActual("@canonical/react-components/dist/hooks");
  return {
    ...hooks,
    usePrevious: jest.fn(),
  };
});

const mockStore = configureStore();

it("renders a spinner while script results are loading", () => {
  const state = rootStateFactory({
    scriptresult: scriptResultStateFactory({
      loading: true,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ControllerCommissioning systemId="abc123" />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading script results")).toBeInTheDocument();
});

it("fetches script results if they haven't been fetched", () => {
  const controller = controllerDetailsFactory();
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    nodescriptresult: nodeScriptResultStateFactory({
      items: {
        [controller.system_id]: [],
      },
    }),
    scriptresult: scriptResultStateFactory({
      items: [],
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ControllerCommissioning systemId={controller.system_id} />
      </MemoryRouter>
    </Provider>
  );

  const expectedAction = scriptResultActions.getByNodeId(controller.system_id);
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("fetches script results if the commissioning status changes to pending", () => {
  // Mock the previous commissioning status being different to pending.
  jest
    .spyOn(reactComponentHooks, "usePrevious")
    .mockImplementation(() => TestStatusStatus.PASSED);
  const controller = controllerDetailsFactory({
    commissioning_status: testStatusFactory({
      status: TestStatusStatus.PENDING, // "new" status is pending
    }),
  });
  const scriptResult = scriptResultFactory({
    hardware_type: HardwareType.Node,
    result_type: ScriptResultType.COMMISSIONING,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    nodescriptresult: nodeScriptResultStateFactory({
      items: {
        [controller.system_id]: [scriptResult.id],
      },
    }),
    scriptresult: scriptResultStateFactory({
      items: [scriptResult],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ControllerCommissioning systemId={controller.system_id} />
      </MemoryRouter>
    </Provider>
  );

  const expectedAction = scriptResultActions.getByNodeId(controller.system_id);
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it(`does not fetch script results if script results exist and commissioning
    status does not change to pending`, () => {
  const controller = controllerDetailsFactory({
    commissioning_status: testStatusFactory({
      status: TestStatusStatus.PASSED,
    }),
  });
  const scriptResult = scriptResultFactory({
    hardware_type: HardwareType.Node,
    result_type: ScriptResultType.COMMISSIONING,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    nodescriptresult: nodeScriptResultStateFactory({
      items: {
        [controller.system_id]: [scriptResult.id],
      },
    }),
    scriptresult: scriptResultStateFactory({
      items: [scriptResult],
      loaded: true,
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ControllerCommissioning systemId={controller.system_id} />
      </MemoryRouter>
    </Provider>
  );

  const expectedAction = scriptResultActions.getByNodeId(controller.system_id);
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toBeUndefined();
});
