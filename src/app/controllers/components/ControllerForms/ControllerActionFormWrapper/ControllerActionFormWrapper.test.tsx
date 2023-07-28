import configureStore from "redux-mock-store";

import ControllerActionFormWrapper from "./ControllerActionFormWrapper";

import { actions as controllerActions } from "app/store/controller";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  controller as controllerFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("ControllerActionFormWrapper", () => {
  it("can set selected controllers to those that can perform action", async () => {
    const state = rootStateFactory();
    const controllers = [
      controllerFactory({ system_id: "abc123", actions: [NodeActions.DELETE] }),
      controllerFactory({ system_id: "def456", actions: [] }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ControllerActionFormWrapper
        action={NodeActions.DELETE}
        clearSidePanelContent={jest.fn()}
        controllers={controllers}
        viewingDetails={false}
      />,
      { route: "/controllers", store }
    );

    await userEvent.click(screen.getByTestId("on-update-selected"));

    const expectedAction = controllerActions.setSelected(["abc123"]);
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
