import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import RemoveInterface from "./RemoveInterface";

import * as analyticsHooks from "app/base/hooks/analytics";
import * as baseHooks from "app/base/hooks/base";
import { actions as deviceActions } from "app/store/device";
import type { RootState } from "app/store/root/types";
import {
  deviceDetails as deviceDetailsFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("RemoveInterface", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceDetailsFactory({ system_id: "abc123" })],
        loaded: true,
        statuses: deviceStatusesFactory({
          abc123: deviceStatusFactory(),
        }),
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sends an analytics event and closes the form when saved", () => {
    const closeExpanded = jest.fn();
    const useSendMock = jest.spyOn(analyticsHooks, "useSendAnalyticsWhen");
    // Mock interface successfully being deleted.
    jest.spyOn(baseHooks, "useCycled").mockReturnValue([true, () => null]);
    const store = mockStore(state);
    renderWithMockStore(
      <RemoveInterface
        closeExpanded={closeExpanded}
        nicId={1}
        systemId="abc123"
      />,
      { store }
    );

    expect(closeExpanded).toHaveBeenCalled();
    expect(useSendMock.mock.calls[0]).toEqual([
      true,
      "Device network",
      "Remove interface",
      "Remove",
    ]);
  });

  it("can show errors related to deleting the interface", () => {
    state.device.eventErrors = [
      deviceEventErrorFactory({
        id: "someOtherDevice",
        error: "Some other error for some other device",
        event: "someOtherError",
      }),
      deviceEventErrorFactory({
        id: "abc123",
        error: "Some other error for this device",
        event: "someOtherError",
      }),
      deviceEventErrorFactory({
        id: "abc123",
        error: "Delete interface error for this device",
        event: "deleteInterface",
      }),
      deviceEventErrorFactory({
        id: "someOtherDevice",
        error: "Delete interface error for this device",
        event: "deleteInterface",
      }),
    ];
    const store = mockStore(state);
    renderWithMockStore(
      <RemoveInterface closeExpanded={jest.fn()} nicId={1} systemId="abc123" />,
      { store }
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Delete interface error for this device"
    );
  });

  it("correctly dispatches an action to delete an interface", async () => {
    const store = mockStore(state);
    renderWithMockStore(
      <RemoveInterface closeExpanded={jest.fn()} nicId={1} systemId="abc123" />,
      { store }
    );

    await userEvent.click(screen.getByTestId("confirm-delete"));

    const expectedAction = deviceActions.deleteInterface({
      interface_id: 1,
      system_id: "abc123",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });
});
