import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import DeviceActionFormWrapper from "./DeviceActionFormWrapper";

import { actions as deviceActions } from "app/store/device";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  device as deviceFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceActionFormWrapper", () => {
  it("can set selected devices to those that can perform action", async () => {
    const state = rootStateFactory();
    const devices = [
      deviceFactory({ system_id: "abc123", actions: [NodeActions.DELETE] }),
      deviceFactory({ system_id: "def456", actions: [] }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceActionFormWrapper
        action={NodeActions.DELETE}
        clearHeaderContent={jest.fn()}
        devices={devices}
        viewingDetails={false}
      />,
      { route: "/devices", store }
    );

    await userEvent.click(screen.getByTestId("on-update-selected"));

    const expectedAction = deviceActions.setSelected(["abc123"]);
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
