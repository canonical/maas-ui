import configureStore from "redux-mock-store";

import { ImageStatus } from "./ImageStatus";

import { ImageSyncStatus } from "@/app/store/controller/types/enum";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ImageStatus", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      controller: factory.controllerState({
        loaded: true,
        items: [
          factory.controller({
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
    state.controller.statuses = factory.controllerStatuses({
      abc123: factory.controllerStatus({ checkingImages: true }),
    });
    renderWithBrowserRouter(<ImageStatus systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("shows the synced state", () => {
    state.controller.imageSyncStatuses = factory.controllerImageSyncStatuses({
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
    state.controller.imageSyncStatuses = factory.controllerImageSyncStatuses({
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
