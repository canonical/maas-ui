import userEvent from "@testing-library/user-event";
import { describe } from "vitest";

import ImagesTable from "./ImagesTable";

import DeleteImages from "@/app/images/components/DeleteImages";
import { ConfigNames } from "@/app/store/config/types";
import { imageFactory } from "@/testing/factories";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
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
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
    value: "noble",
  })
);
const { mockOpen } = await mockSidePanel();

describe("ImagesTable", () => {
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
    it("disables delete for default commissioning release images", async () => {
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
    });
  });

  describe("actions", () => {
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
        title: "Delete images",
        props: { rowSelection: { "1": true }, setRowSelection: vi.fn },
      });
    });
  });
});
