import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageList, { Labels as ImageListLabels } from "./ImageList";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, render, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("ImageList", () => {
  it("stops polling when unmounted", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: false,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageList />
        </MemoryRouter>
      </Provider>
    );
    unmount();
    expect(
      store
        .getActions()
        .some((action) => action.type === "bootresource/pollStop")
    ).toBe(true);
  });

  it("shows a warning if automatic image sync is disabled", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: false,
          }),
        ],
        loaded: true,
      }),
    });
    renderWithBrowserRouter(<ImageList />, {
      route: "/images",
      state,
    });

    expect(screen.getByText(ImageListLabels.SyncDisabled)).toBeInTheDocument();
  });
});
