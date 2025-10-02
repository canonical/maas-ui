import configureStore from "redux-mock-store";

import ControllerActionFormWrapper from "./ControllerActionFormWrapper";

import { controllerActions } from "@/app/store/controller";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ControllerActionFormWrapper", () => {
  it("can set selected controllers to those that can perform action", async () => {
    const state = factory.rootState();
    const controllers = [
      factory.controller({
        system_id: "abc123",
        actions: [NodeActions.DELETE],
      }),
      factory.controller({ system_id: "def456", actions: [] }),
    ];
    const store = mockStore(state);
    renderWithProviders(
      <ControllerActionFormWrapper
        action={NodeActions.DELETE}
        controllers={controllers}
        viewingDetails={false}
      />,
      { initialEntries: ["/controllers"], store }
    );

    await userEvent.click(screen.getByTestId("on-update-selected"));

    const expectedAction = controllerActions.setSelected(["abc123"]);
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
