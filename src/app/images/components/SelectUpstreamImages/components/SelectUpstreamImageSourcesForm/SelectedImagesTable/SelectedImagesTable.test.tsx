import SelectedImagesTable from "./SelectedImagesTable";

import type { SelectedImage } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";
import { availableImageFactory, imageSourceFactory } from "@/testing/factories";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  mockIsPending,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  imageSourceResolvers.listImageSources.handler(),
  imageResolvers.listAvailableSelections.handler(),
  imageResolvers.listSelections.handler()
);

const mockSelectedImage: SelectedImage = {
  ...availableImageFactory.build({
    os: "ubuntu",
    release: "noble",
    title: "24.04 LTS",
    architecture: "amd64",
    source_id: 1,
  }),
  id: "ubuntu&noble&24.04 LTS&amd64",
};

describe("SelectedImagesTable", () => {
  describe("display", () => {
    it("displays a loading component if images are loading", async () => {
      mockIsPending();
      renderWithProviders(
        <SelectedImagesTable
          selectedImages={[mockSelectedImage]}
          setSelectedImages={vi.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      renderWithProviders(
        <SelectedImagesTable selectedImages={[]} setSelectedImages={vi.fn()} />
      );

      await waitFor(() => {
        expect(
          screen.getByText("No upstream images were selected.")
        ).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(
        <SelectedImagesTable selectedImages={[]} setSelectedImages={vi.fn()} />
      );

      ["Release title", "Architecture", "Source"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });

    it("shows a loading spinner in the source cell while sources are being fetched", () => {
      renderWithProviders(
        <SelectedImagesTable
          selectedImages={[mockSelectedImage]}
          setSelectedImages={vi.fn()}
        />
      );
      // Synchronously after mount, before MSW responds, isSourcesPending is true
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("actions", () => {
    it("calls setSelectedImages without the removed image when the remove button is clicked", async () => {
      const setSelectedImages = vi.fn();
      renderWithProviders(
        <SelectedImagesTable
          selectedImages={[mockSelectedImage]}
          setSelectedImages={setSelectedImages}
        />
      );
      await waitForLoading();
      await userEvent.click(screen.getByRole("button", { name: /remove/i }));
      expect(setSelectedImages).toHaveBeenCalledWith([]);
    });

    it("calls setSelectedImages with the updated source_id when a different source is selected", async () => {
      const setSelectedImages = vi.fn();
      mockServer.use(
        imageSourceResolvers.listImageSources.handler({
          items: [
            imageSourceFactory.build({ id: 1, name: "MAAS Stable" }),
            imageSourceFactory.build({ id: 2, name: "MAAS Candidate" }),
          ],
          total: 2,
        }),
        imageResolvers.listAvailableSelections.handler({
          items: [
            availableImageFactory.build({
              os: "ubuntu",
              release: "noble",
              architecture: "amd64",
              source_id: 1,
            }),
            availableImageFactory.build({
              os: "ubuntu",
              release: "noble",
              architecture: "amd64",
              source_id: 2,
            }),
          ],
        })
      );
      renderWithProviders(
        <SelectedImagesTable
          selectedImages={[mockSelectedImage]}
          setSelectedImages={setSelectedImages}
        />
      );
      await waitForLoading();

      await userEvent.click(
        screen.getByRole("button", { name: /MAAS Stable/i })
      );
      await userEvent.click(
        screen.getByRole("menuitem", { name: "MAAS Candidate" })
      );

      expect(setSelectedImages).toHaveBeenCalledWith([
        { ...mockSelectedImage, source_id: 2 },
      ]);
    });
  });
});
