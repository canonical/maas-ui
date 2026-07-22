import userEvent from "@testing-library/user-event";
import { describe } from "vitest";

import ImagesTable from "./ImagesTable";

import DeleteImages from "@/app/images/components/DeleteImages";
import { ConfigNames } from "@/app/store/config/types";
import {
  availableImageFactory,
  imageFactory,
  imageSourceFactory,
  imageStatusFactory,
} from "@/testing/factories";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageSyncResolvers } from "@/testing/resolvers/imageSync";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
  within,
  mockIsPending,
  mockSidePanel,
  waitForLoading,
} from "@/testing/utils";

const failureMock = vi.fn();

vi.mock("@canonical/react-components", async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    useToastNotification: () => ({
      failure: failureMock,
      success: vi.fn(),
      caution: vi.fn(),
      info: vi.fn(),
    }),
  };
});

const mockServer = setupMockServer(
  imageResolvers.listSelections.handler(),
  imageResolvers.listSelectionStatistics.handler(),
  imageResolvers.listSelectionStatuses.handler(),
  imageResolvers.listCustomImages.handler(),
  imageResolvers.listCustomImageStatistics.handler(),
  imageResolvers.listCustomImageStatuses.handler(),
  imageResolvers.listAvailableSelections.handler(),
  imageSourceResolvers.listImageSources.handler(),
  imageSyncResolvers.startSynchronization.handler(),
  imageSyncResolvers.stopSynchronization.handler(),
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
    value: "noble",
  })
);
const { mockOpen } = await mockSidePanel();

describe("ImagesTable", () => {
  beforeEach(() => {
    // Clear localStorage between tests to prevent optimistic state pollution
    localStorage.clear();
    failureMock.mockReset();
  });

  describe("display", () => {
    it("displays a loading component if images are loading", async () => {
      mockIsPending();
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({ items: [], total: 0 }),
        imageResolvers.listCustomImages.handler({ items: [], total: 0 })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );

      await waitFor(() => {
        expect(
          screen.getByText("No images have been selected to sync.")
        ).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );

      [
        "Release title",
        "Architecture",
        "Size",
        "Version",
        "Status",
        "Source",
        "Actions",
      ].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });

    it("does not show statistics if request fails", async () => {
      mockServer.use(imageResolvers.listSelectionStatistics.error());

      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );

      await waitFor(() => {
        expect(
          within(
            screen.getByRole("row", {
              name: new RegExp("jammy", "i"),
            })
          ).queryByText("undefined")
        ).not.toBeInTheDocument();
      });
    });

    it("shows 'Custom' label and hides sync controls for non-upstream images", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({ items: [], total: 0 }),
        imageResolvers.listCustomImages.handler({
          items: [
            imageFactory.build({
              id: 1,
              os: "centos",
              release: "centos8",
              title: "CentOS 8",
            }),
          ],
          total: 1,
        }),
        imageResolvers.listCustomImageStatuses.handler({
          items: [imageStatusFactory.build({ id: 1 })],
          total: 1,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      const row = screen.getByRole("row", { name: /centos8/i });
      expect(within(row).getByText("Custom")).toBeInTheDocument();
      expect(
        within(row).queryByRole("button", { name: "Start synchronization" })
      ).not.toBeInTheDocument();
      expect(
        within(row).queryByRole("button", { name: "Stop synchronization" })
      ).not.toBeInTheDocument();
    });

    it("restores optimistic downloading state from local storage on mount", async () => {
      localStorage.setItem(
        "optimisticImages",
        "OptimisticDownloading=1;OptimisticStopping="
      );
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [imageFactory.build({ id: 1, release: "jammy" })],
          total: 1,
        }),
        imageResolvers.listSelectionStatuses.handler({
          items: [
            imageStatusFactory.build({
              id: 1,
              status: "Waiting for download",
              update_status: "Update available",
            }),
          ],
          total: 1,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );

      await waitFor(() => {
        expect(screen.getAllByText("Queueing...").length).toBeGreaterThan(0);
      });
    });
  });

  describe("permissions", () => {
    it("disables image source change for images being downloaded", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [
            imageFactory.build({ id: 1, release: "jammy", title: "22.04 LTS" }),
          ],
          total: 1,
        }),
        imageResolvers.listSelectionStatuses.handler({
          items: [imageStatusFactory.build({ id: 1, status: "Downloading" })],
          total: 1,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      const row = screen.getByRole("row", { name: /jammy/i });
      const sourceToggle = within(row).getByRole("button", {
        name: /MAAS Stable/i,
      });
      expect(sourceToggle).toBeAriaDisabled();
    });

    it("disables selection, and delete/start sync for images being downloaded, enables stop sync", async () => {
      localStorage.setItem(
        "optimisticImages",
        "OptimisticDownloading=1;OptimisticStopping="
      );
      mockServer.use(
        imageResolvers.listSelectionStatuses.handler({
          items: [
            imageStatusFactory.build({
              id: 1,
              status: "Waiting for download",
            }),
            imageStatusFactory.build({
              id: 2,
              status: "Downloading",
              sync_percentage: 50,
            }),
          ],
          total: 3,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      const row = screen.getByRole("row", {
        name: new RegExp("jammy", "i"),
      });

      expect(within(row).getByText("50%")).toBeInTheDocument();

      const selectionCheckbox = within(row).getByRole("checkbox", {
        name: new RegExp("select", "i"),
      });

      expect(selectionCheckbox).toBeAriaDisabled();
      await userEvent.hover(selectionCheckbox);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Cannot modify images that are currently being downloaded."
          )
        ).toBeInTheDocument();
      });

      // Start button is replaced by stop
      expect(
        within(row).queryByRole("button", {
          name: "Start synchronization",
        })
      ).not.toBeInTheDocument();

      const stopButton = within(row).getByRole("button", {
        name: "Stop synchronization",
      });
      const deleteButton = within(row).getByRole("button", { name: "Delete" });

      expect(stopButton).not.toBeAriaDisabled();

      expect(deleteButton).toBeAriaDisabled();
      await userEvent.hover(deleteButton);

      await waitFor(() => {
        expect(deleteButton).toHaveAccessibleDescription(
          "Cannot delete images that are currently being downloaded."
        );
      });

      const nobleRow = screen.getByRole("row", { name: /noble/i });

      const nobleCheckbox = within(nobleRow).getByRole("checkbox", {
        name: /select/i,
      });
      expect(nobleCheckbox).toBeAriaDisabled();

      const nobleStopButton = within(nobleRow).getByRole("button", {
        name: "Stop synchronization",
      });
      expect(nobleStopButton).toBeAriaDisabled();
    });

    it("disables start sync and shows Won't sync status for images not selected from the current source", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [imageFactory.build({ id: 1, release: "jammy" })],
          total: 1,
        }),
        imageResolvers.listSelectionStatuses.handler({
          items: [
            imageStatusFactory.build({
              id: 1,
              selected: false,
              status: "Ready",
              update_status: "No updates available",
            }),
          ],
          total: 1,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      const row = screen.getByRole("row", { name: /jammy/i });

      expect(within(row).getByText("Won't sync")).toBeInTheDocument();

      const startButton = within(row).getByRole("button", {
        name: "Start synchronization",
      });
      expect(startButton).toBeAriaDisabled();

      await userEvent.hover(startButton);
      await waitFor(() => {
        expect(
          screen.getByText(
            "This image release cannot be synchronized since it is already selected from a more prioritized source."
          )
        ).toBeInTheDocument();
      });
    });

    it("disables start sync when image is already synchronized", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [imageFactory.build({ id: 1, release: "jammy" })],
          total: 1,
        }),
        imageResolvers.listSelectionStatuses.handler({
          items: [
            imageStatusFactory.build({
              id: 1,
              status: "Ready",
              update_status: "No updates available",
            }),
          ],
          total: 1,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      const row = screen.getByRole("row", { name: /jammy/i });
      const startButton = within(row).getByRole("button", {
        name: "Start synchronization",
      });

      expect(startButton).toBeAriaDisabled();

      await userEvent.hover(startButton);
      await waitFor(() => {
        expect(
          screen.getByText("Image is already synchronized.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("actions", () => {
    it("calls image delete, and then adds the new selection on source change", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [
            imageFactory.build({
              id: 1,
              release: "jammy",
              title: "22.04 LTS",
              architecture: "amd64",
              boot_source_id: 1,
            }),
          ],
          total: 1,
        }),
        imageResolvers.listAvailableSelections.handler({
          items: [
            availableImageFactory.build({
              os: "ubuntu",
              release: "jammy",
              architecture: "amd64",
              source_id: 1,
            }),
            availableImageFactory.build({
              os: "ubuntu",
              release: "jammy",
              architecture: "amd64",
              source_id: 2,
            }),
          ],
        }),
        imageSourceResolvers.listImageSources.handler({
          items: [
            imageSourceFactory.build({ id: 1, name: "MAAS Stable" }),
            imageSourceFactory.build({ id: 2, name: "MAAS Daily" }),
          ],
          total: 2,
        }),
        imageResolvers.deleteSelections.handler(),
        imageResolvers.addSelections.handler()
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      const row = screen.getByRole("row", { name: /jammy/i });
      await userEvent.click(
        within(row).getByRole("button", { name: /MAAS Stable/i })
      );

      await userEvent.click(
        screen.getByRole("menuitem", { name: "MAAS Daily" })
      );

      await waitFor(() => {
        expect(imageResolvers.deleteSelections.resolved).toBeTruthy();
      });
      await waitFor(() => {
        expect(imageResolvers.addSelections.resolved).toBeTruthy();
      });
    });

    it("opens delete image side panel form", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [
            imageFactory.build({
              id: 1,
              release: "jammy",
            }),
          ],
          total: 3,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: DeleteImages,
        title: "Delete image",
        props: {
          rowSelection: { "1-selection": true },
          setRowSelection: vi.fn,
        },
      });
    });

    it("calls start sync", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [
            imageFactory.build({
              id: 1,
              release: "jammy",
            }),
          ],
          total: 1,
        }),
        imageResolvers.listSelectionStatuses.handler({
          items: [
            imageStatusFactory.build({
              id: 1,
              status: "Waiting for download",
            }),
          ],
          total: 1,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Start synchronization" })
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Start synchronization" })
      );

      await waitFor(() => {
        expect(imageSyncResolvers.startSynchronization.resolved).toBeTruthy();
      });
    });

    it("calls stop sync", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [
            imageFactory.build({
              id: 1,
              release: "jammy",
            }),
          ],
          total: 1,
        }),
        imageResolvers.listSelectionStatuses.handler({
          items: [imageStatusFactory.build({ id: 1, status: "Downloading" })],
          total: 1,
        })
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Stop synchronization" })
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Stop synchronization" })
      );

      await waitFor(() => {
        expect(imageSyncResolvers.stopSynchronization.resolved).toBeTruthy();
      });
    });

    it("includes row count in the delete panel title when other rows are pre-selected", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [
            imageFactory.build({ id: 1, release: "noble" }),
            imageFactory.build({ id: 2, release: "jammy" }),
          ],
          total: 2,
        })
      );
      renderWithProviders(
        <ImagesTable
          selectedRows={{ "1-selection": true }}
          setSelectedRows={vi.fn}
        />
      );
      await waitForLoading();

      const jammyRow = screen.getByRole("row", { name: /jammy/i });
      await userEvent.click(
        within(jammyRow).getByRole("button", { name: "Delete" })
      );

      expect(mockOpen).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Delete 2 images",
        })
      );
    });

    it("shows a failure notification when start synchronization fails", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [imageFactory.build({ id: 1, release: "jammy" })],
          total: 1,
        }),
        imageResolvers.listSelectionStatuses.handler({
          items: [
            imageStatusFactory.build({
              id: 1,
              status: "Waiting for download",
              update_status: "Update available",
            }),
          ],
          total: 1,
        }),
        imageSyncResolvers.startSynchronization.error()
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      await userEvent.click(
        screen.getByRole("button", { name: "Start synchronization" })
      );

      await waitFor(() => {
        expect(failureMock).toHaveBeenCalledWith(
          "Starting image synchronization failed. Please try again.",
          expect.anything()
        );
      });
    });

    it("shows a failure notification when stop synchronization fails", async () => {
      mockServer.use(
        imageResolvers.listSelections.handler({
          items: [imageFactory.build({ id: 1, release: "jammy" })],
          total: 1,
        }),
        imageResolvers.listSelectionStatuses.handler({
          items: [imageStatusFactory.build({ id: 1, status: "Downloading" })],
          total: 1,
        }),
        imageSyncResolvers.stopSynchronization.error()
      );
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      await userEvent.click(
        screen.getByRole("button", { name: "Stop synchronization" })
      );

      await waitFor(() => {
        expect(failureMock).toHaveBeenCalledWith(
          "Stopping image synchronization failed. Please try again.",
          expect.anything()
        );
      });
    });
  });
});
