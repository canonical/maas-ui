import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageListHeader, {
  Labels as ImageListHeaderLabels,
} from "./ImageListHeader";

import { actions as configActions } from "app/store/config";
import { ConfigNames } from "app/store/config/types";
import {
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("ImageListHeader", () => {
  it("sets the subtitle loading state when polling", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: true,
        }),
      }),
    });
    renderWithBrowserRouter(<ImageListHeader />, {
      route: "/images",
      wrapperProps: { state },
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("does not show sync toggle if config has not loaded yet", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: true,
        }),
      }),
      config: configStateFactory({
        loaded: false,
      }),
    });
    renderWithBrowserRouter(<ImageListHeader />, {
      route: "/images",
      wrapperProps: { state },
    });

    expect(
      screen.queryByRole("checkbox", {
        name: ImageListHeaderLabels.AutoSyncImages,
      })
    ).not.toBeInTheDocument();
  });

  it("dispatches an action to update config when changing the auto sync switch", async () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: true,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageListHeader />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: ImageListHeaderLabels.AutoSyncImages,
      })
    );

    const actualActions = store.getActions();
    const expectedAction = configActions.update({
      boot_images_auto_import: false,
    });
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });

  it("can show the rack import status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        rackImportRunning: true,
      }),
    });
    renderWithBrowserRouter(<ImageListHeader />, {
      route: "/images",
      wrapperProps: { state },
    });

    expect(
      screen.getByText(ImageListHeaderLabels.RackControllersImporting)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(ImageListHeaderLabels.RegionControllerImporting)
    ).not.toBeInTheDocument();
  });

  it("can show the region import status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        regionImportRunning: true,
      }),
    });
    renderWithBrowserRouter(<ImageListHeader />, {
      route: "/images",
      wrapperProps: { state },
    });

    expect(
      screen.getByText(ImageListHeaderLabels.RegionControllerImporting)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(ImageListHeaderLabels.RackControllersImporting)
    ).not.toBeInTheDocument();
  });
});
