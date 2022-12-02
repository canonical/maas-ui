import { screen } from "@testing-library/react";
import configureStore from "redux-mock-store";

import { ImageStatus } from "./ImageStatus";

import { ImageSyncStatus } from "app/store/controller/types/enum";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerImageSyncStatuses as controllerImageSyncStatusesFactory,
  controllerState as controllerStateFactory,
  controllerStatus as controllerStatusFactory,
  controllerStatuses as controllerStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("ImageStatus", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("starts polling the image status", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<ImageStatus systemId="abc123" />, {
      route: "/controllers",
      store,
    });
    expect(
      store
        .getActions()
        .some((action) => action.type === "controller/pollCheckImages")
    ).toBe(true);
  });

  it("stops polling when unmounting", () => {
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(
      <ImageStatus systemId="abc123" />,
      { route: "/", store }
    );
    unmount();
    expect(
      store
        .getActions()
        .some((action) => action.type === "controller/pollCheckImagesStop")
    ).toBe(true);
  });

  it("shows a spinner when polling", () => {
    state.controller.statuses = controllerStatusesFactory({
      abc123: controllerStatusFactory({ checkingImages: true }),
    });
    renderWithBrowserRouter(<ImageStatus systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("shows the synced state", () => {
    state.controller.imageSyncStatuses = controllerImageSyncStatusesFactory({
      abc123: ImageSyncStatus.Synced,
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<ImageStatus systemId="abc123" />, {
      route: "/controllers",
      store,
    });
    expect(screen.getByTestId("sync-success-icon")).toHaveClass(
      "p-icon--success-grey"
    );
    expect(screen.getByTestId("status")).toHaveTextContent(
      ImageSyncStatus.Synced
    );
  });

  it("shows a state that is not synced", () => {
    state.controller.imageSyncStatuses = controllerImageSyncStatusesFactory({
      abc123: ImageSyncStatus.Syncing,
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<ImageStatus systemId="abc123" />, {
      route: "/controllers",
      store,
    });
    expect(screen.queryByTestId("sync-success-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("status")).toHaveTextContent(
      ImageSyncStatus.Syncing
    );
  });
});
