import configureStore from "redux-mock-store";
import { vi } from "vitest";

import ImageListHeader, {
  Labels as ImageListHeaderLabels,
} from "./ImageListHeader";

import DeleteImages from "@/app/images/components/DeleteImages";
import SelectUpstreamImagesForm from "@/app/images/components/SelectUpstreamImagesForm";
import { bootResourceActions } from "@/app/store/bootresource";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  within,
  renderWithProviders,
  mockSidePanel,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();

describe("ImageListHeader", () => {
  it("sets the subtitle loading state when polling", () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        statuses: factory.bootResourceStatuses({
          polling: true,
        }),
      }),
    });
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />,
      {
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
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />,
      {
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
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />,
      {
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
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
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
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
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
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
    );
    const images_from = screen.getByText("Images synced from");
    expect(within(images_from).getByText("sources")).toBeInTheDocument();
  });
});

describe("Select upstream images", () => {
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

    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Select upstream images" })
    );

    expect(mockOpen).toHaveBeenCalledWith({
      component: SelectUpstreamImagesForm,
      title: "Select upstream images to sync",
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        store,
      }
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
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
    );
    const stopImportButton = screen.getByRole("button", {
      name: "Stop image import",
    });
    expect(stopImportButton).toBeEnabled();
  });
});

describe("Delete", () => {
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
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />,
      {
        state,
      }
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
    renderWithProviders(
      <ImageListHeader selectedRows={{ 1: true }} setSelectedRows={vi.fn} />,
      {
        state,
      }
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: DeleteImages,
      props: {
        rowSelection: { 1: true },
        setRowSelection: expect.any(Function),
      },
      title: "Delete images",
    });
  });
});
