import configureStore from "redux-mock-store";

import DeviceActionFormWrapper from "./DeviceActionFormWrapper";

import { deviceActions } from "@/app/store/device";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceActionFormWrapper", () => {
  it("can set selected devices to those that can perform action", async () => {
    const state = factory.rootState();
    const devices = [
      factory.device({ system_id: "abc123", actions: [NodeActions.DELETE] }),
      factory.device({ system_id: "def456", actions: [] }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceActionFormWrapper
        action={NodeActions.DELETE}
        clearSidePanelContent={vi.fn()}
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
