import configureStore from "redux-mock-store";
import { vi } from "vitest";

import ImageListHeader, {
  Labels as ImageListHeaderLabels,
} from "./ImageListHeader";

import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("ImageListHeader", () => {
  it("sets the subtitle loading state when polling", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          polling: true,
        }),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />,
      {
        route: "/images",
        state,
      }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("does not show sync toggle if config has not loaded yet", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          polling: true,
        }),
      }),
      config: factory.configState({
        loaded: false,
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />,
      {
        route: "/images",
        state,
      }
    );

    expect(
      screen.queryByRole("checkbox", {
        name: new RegExp(ImageListHeaderLabels.AutoSyncImages),
      })
    ).not.toBeInTheDocument();
  });

  it("dispatches an action to update config when changing the auto sync switch", async () => {
    const state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: true,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />,
      {
        route: "/images",
        store,
      }
    );

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: new RegExp(ImageListHeaderLabels.AutoSyncImages),
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
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        rackImportRunning: true,
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />,
      {
        route: "/images",
        state,
      }
    );

    expect(
      screen.getByText(ImageListHeaderLabels.RackControllersImporting)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(ImageListHeaderLabels.RegionControllerImporting)
    ).not.toBeInTheDocument();
  });

  it("can show the region import status", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        regionImportRunning: true,
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />,
      {
        route: "/images",
        state,
      }
    );

    expect(
      screen.getByText(ImageListHeaderLabels.RegionControllerImporting)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(ImageListHeaderLabels.RackControllersImporting)
    ).not.toBeInTheDocument();
  });
});
