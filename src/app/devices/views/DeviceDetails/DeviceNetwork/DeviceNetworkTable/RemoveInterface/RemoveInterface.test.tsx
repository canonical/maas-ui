import configureStore from "redux-mock-store";

import RemoveInterface from "./RemoveInterface";

import * as analyticsHooks from "@/app/base/hooks/analytics";
import * as baseHooks from "@/app/base/hooks/base";
import { actions as deviceActions } from "@/app/store/device";
import type { RootState } from "@/app/store/root/types";
import {
  deviceDetails as deviceDetailsFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

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
    vi.restoreAllMocks();
  });

  it("sends an analytics event and closes the form when saved", () => {
    const closeForm = vi.fn();
    const useSendMock = vi.spyOn(analyticsHooks, "useSendAnalyticsWhen");
    // Mock interface successfully being deleted.
    vi.spyOn(baseHooks, "useCycled").mockReturnValue([true, () => null]);
    const store = mockStore(state);
    renderWithBrowserRouter(
      <RemoveInterface closeForm={closeForm} nicId={1} systemId="abc123" />,
      { store }
    );

    expect(closeForm).toHaveBeenCalled();
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
    renderWithBrowserRouter(
      <RemoveInterface closeForm={vi.fn()} nicId={1} systemId="abc123" />,
      { store }
    );

    expect(
      screen.getByText("Delete interface error for this device")
    ).toBeInTheDocument();
  });

  it("correctly dispatches an action to delete an interface", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <RemoveInterface closeForm={vi.fn()} nicId={1} systemId="abc123" />,
      { store }
    );

    await userEvent.click(screen.getByRole("button", { name: /remove/i }));

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
