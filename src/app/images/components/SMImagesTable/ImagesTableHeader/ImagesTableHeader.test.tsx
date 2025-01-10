import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { describe, vi } from "vitest";

import ImagesTableHeader from "./ImagesTableHeader";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { ImageSidePanelViews } from "@/app/images/constants";
import { bootResourceActions } from "@/app/store/bootresource";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  within,
  renderWithBrowserRouter,
  expectTooltipOnHover,
  render,
} from "@/testing/utils";

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

  it("can trigger change source side panel form", async () => {
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
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Change source" })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ImageSidePanelViews.CHANGE_SOURCE,
      extras: { hasSources: true },
    });
  });

  it("renders the change source form and disables closing it if no sources are detected", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        ubuntu: factory.bootResourceUbuntu({ sources: [] }),
      }),
    });
    renderWithBrowserRouter(
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ImageSidePanelViews.CHANGE_SOURCE,
      extras: { hasSources: false },
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
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    const images_from = screen.getByText("Showing images synced from");
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
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    const images_from = screen.getByText("Showing images synced from");
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
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    const images_from = screen.getByText("Showing images synced from");
    expect(within(images_from).getByText("sources")).toBeInTheDocument();
  });

  it("disables the button to change source if resources are downloading", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [factory.bootResource({ downloading: true })],
        ubuntu: factory.bootResourceUbuntu({
          sources: [factory.bootResourceUbuntuSource()],
        }),
      }),
    });
    renderWithBrowserRouter(
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    expect(
      screen.getByRole("button", { name: "Change source" })
    ).toBeAriaDisabled();

    await expectTooltipOnHover(
      screen.getByRole("button", { name: "Change source" }),
      "Cannot change source while images are downloading."
    );
  });
});

describe("Download images", () => {
  const setSidePanelContent = vi.fn();

  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });

  it("can trigger download images side panel form", async () => {
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
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Download images" })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ImageSidePanelViews.DOWNLOAD_IMAGE,
    });
  });

  it("does not show a button to download images if there are images already downloading", () => {
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
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
    );

    expect(
      screen.queryByRole("button", { name: "Download images" })
    ).not.toBeInTheDocument();
  });
});

describe("Stop import", () => {
  const mockStore = configureStore<RootState, {}>();

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
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
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
          <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(screen.getByRole("button", { name: "Stop import" }));

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
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />,
      { state }
    );
    const stopImportButton = screen.getByRole("button", {
      name: "Stop import",
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
    renderWithBrowserRouter(
      <ImagesTableHeader selectedRows={{}} setSelectedRows={() => {}} />
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
  });

  it("can trigger delete images side panel form", async () => {
    renderWithBrowserRouter(
      <ImagesTableHeader selectedRows={{ 1: true }} setSelectedRows={vi.fn} />
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
