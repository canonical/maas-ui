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
  });

  describe("display", () => {
    it("displays a loading component if pools are loading", async () => {
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

    it("disables delete and select for default commissioning release images", async () => {
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      const row = screen.getByRole("row", {
        name: new RegExp("noble", "i"),
      });
      const deleteButton = within(row).getByRole("button", { name: "Delete" });
      expect(deleteButton).toBeAriaDisabled();
      await userEvent.hover(deleteButton);

      await waitFor(() => {
        expect(deleteButton).toHaveAccessibleDescription(
          "Cannot delete images of the default commissioning release."
        );
      });

      const selectionCheckbox = within(row).getByRole("checkbox", {
        name: "select 24.04 LTS",
      });
      expect(selectionCheckbox).toBeAriaDisabled();
      await userEvent.hover(selectionCheckbox);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Cannot modify images of the default commissioning release."
          )
        ).toBeInTheDocument();
      });
    });

    it("disables selection, and delete/start sync for images being downloaded, enables stop sync", async () => {
      mockServer.use(
        imageResolvers.listSelectionStatuses.handler({
          items: [
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
    });

    it("disables stop sync when there is no download", async () => {
      renderWithProviders(
        <ImagesTable selectedRows={{}} setSelectedRows={vi.fn} />
      );
      await waitForLoading();

      const row = screen.getByRole("row", {
        name: new RegExp("jammy", "i"),
      });
      expect(
        within(row).queryByRole("button", {
          name: "Stop synchronization",
        })
      ).not.toBeInTheDocument();
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
  });
});
