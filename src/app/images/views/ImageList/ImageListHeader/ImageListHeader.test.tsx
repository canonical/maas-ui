import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageListHeader, {
  Labels as ImageListHeaderLabels,
} from "./ImageListHeader";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { ImageSidePanelViews } from "@/app/images/constants";
import { bootResourceActions } from "@/app/store/bootresource";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  renderWithBrowserRouter,
  within,
} from "@/testing/utils";
import { vi } from "vitest";

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

describe("Change sources", () => {
  const setSidePanelContent = vi.fn();

  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });

  it("renders the correct text for a single default source", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntu: factory.bootResourceUbuntu({
          sources: [
            factory.bootResourceUbuntuSource({
              source_type: BootResourceSourceType.MAAS_IO,
            }),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    const images_from = screen.getByText("Images synced from");
    expect(within(images_from).getByText("maas.io")).toBeInTheDocument();
  });

  it("renders the correct text for a single custom source", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntu: factory.bootResourceUbuntu({
          sources: [
            factory.bootResourceUbuntuSource({
              source_type: BootResourceSourceType.CUSTOM,
              url: "www.url.com",
            }),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    const images_from = screen.getByText("Images synced from");
    expect(within(images_from).getByText("www.url.com")).toBeInTheDocument();
  });

  it("renders the correct text for multiple sources", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntu: factory.bootResourceUbuntu({
          sources: [
            factory.bootResourceUbuntuSource(),
            factory.bootResourceUbuntuSource(),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    const images_from = screen.getByText("Images synced from");
    expect(within(images_from).getByText("sources")).toBeInTheDocument();
  });
});

describe("Select upstream images", () => {
  const setSidePanelContent = vi.fn();

  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });

  it("can trigger select upstream images side panel form", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntu: factory.bootResourceUbuntu({
          sources: [
            factory.bootResourceUbuntuSource({
              source_type: BootResourceSourceType.MAAS_IO,
            }),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Select upstream images" })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ImageSidePanelViews.DOWNLOAD_IMAGE,
    });
  });

  it("does not show a button to select upstream images if there are images already downloading", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
          factory.bootResource({ downloading: false, name: "centos/centos70" }),
        ],
        ubuntu: factory.bootResourceUbuntu(),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
    );

    expect(
      screen.queryByRole("button", { name: "Select upstream images" })
    ).toBeAriaDisabled();
  });
});

describe("Stop import", () => {
  const mockStore = configureStore<RootState>();

  it("does not show a button to stop importing ubuntu images if none are downloading", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: false, name: "ubuntu/focal" }),
          factory.bootResource({ downloading: false, name: "centos/centos70" }),
        ],
        ubuntu: factory.bootResourceUbuntu(),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
    );

    expect(
      screen.queryByRole("button", { name: "Stop import" })
    ).not.toBeInTheDocument();
  });

  it("can dispatch an action to stop importing ubuntu images if at least one is downloading", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
        ],
        ubuntu: factory.bootResourceUbuntu(),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Stop image import" })
    );

    const expectedAction = bootResourceActions.stopImport();
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("enables 'Stop import' button if images are saving", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [
          factory.bootResource({ downloading: true, name: "ubuntu/focal" }),
        ],
        ubuntu: factory.bootResourceUbuntu(),
        statuses: factory.bootResourceStatuses({ savingUbuntu: true }),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    const stopImportButton = screen.getByRole("button", {
      name: "Stop image import",
    });
    expect(stopImportButton).toBeEnabled();
  });
});

describe("Delete", () => {
  const setSidePanelContent = vi.fn();

  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });

  it("disables the button to delete images if no rows are selected", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntu: factory.bootResourceUbuntu({
          sources: [
            factory.bootResourceUbuntuSource({
              source_type: BootResourceSourceType.MAAS_IO,
            }),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
  });

  it("can trigger delete images side panel form", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntu: factory.bootResourceUbuntu({
          sources: [
            factory.bootResourceUbuntuSource({
              source_type: BootResourceSourceType.MAAS_IO,
            }),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(
      <ImageListHeader selectedRows={{ 1: true }} setSelectedRows={vi.fn} />,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ImageSidePanelViews.DELETE_MULTIPLE_IMAGES,
      extras: {
        rowSelection: { 1: true },
        setRowSelection: vi.fn,
      },
    });
  });
});
