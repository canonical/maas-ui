import configureStore from "redux-mock-store";

import ImageList, { Labels as ImageListLabels } from "./ImageList";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  screen,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();
const mockServer = setupMockServer(
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
    value: true,
  })
);

describe("ImageList", () => {
  it("stops polling when unmounted", () => {
    const state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: false,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const { result } = renderWithProviders(<ImageList />, {
      store,
    });
    result.unmount();
    expect(
      store
        .getActions()
        .some((action) => action.type === "bootresource/pollStop")
    ).toBe(true);
  });

  it("shows a warning if automatic image sync is disabled", async () => {
    mockServer.use(
      configurationsResolvers.getConfiguration.handler({
        name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
        value: false,
      })
    );
    renderWithProviders(<ImageList />);
    await waitForLoading();
    expect(screen.getByText(ImageListLabels.SyncDisabled)).toBeInTheDocument();
  });
});
