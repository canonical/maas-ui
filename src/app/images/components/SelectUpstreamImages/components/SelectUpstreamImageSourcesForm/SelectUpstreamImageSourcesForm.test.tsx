import SelectUpstreamImageSourcesForm from "./SelectUpstreamImageSourcesForm";

import { SelectUpstreamImagesSteps } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";
import { availableImageFactory } from "@/testing/factories";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  imageResolvers.addSelections.handler(),
  imageResolvers.listAvailableSelections.handler(),
  imageSourceResolvers.listImageSources.handler()
);

const { mockClose } = await mockSidePanel();

const mockSelectedImage = {
  ...availableImageFactory.build({
    os: "ubuntu",
    release: "noble",
    title: "24.04 LTS",
    architecture: "amd64",
    source_id: 1,
  }),
  id: "ubuntu&noble&24.04 LTS&amd64",
};

describe("SelectUpstreamImageSourcesForm", () => {
  it("renders the selected images table", () => {
    renderWithProviders(
      <SelectUpstreamImageSourcesForm
        selectedImages={[mockSelectedImage]}
        setSelectedImages={vi.fn()}
        setStep={vi.fn()}
      />
    );
    expect(
      screen.getByRole("treegrid", { name: "Selected images table" })
    ).toBeInTheDocument();
  });

  it("disables the submit button when no images are selected", () => {
    renderWithProviders(
      <SelectUpstreamImageSourcesForm
        selectedImages={[]}
        setSelectedImages={vi.fn()}
        setStep={vi.fn()}
      />
    );
    expect(
      screen.getByRole("button", { name: "Save and sync" })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("enables the submit button when at least one image is selected", () => {
    renderWithProviders(
      <SelectUpstreamImageSourcesForm
        selectedImages={[mockSelectedImage]}
        setSelectedImages={vi.fn()}
        setStep={vi.fn()}
      />
    );
    expect(
      screen.getByRole("button", { name: "Save and sync" })
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("navigates back to the image selection step when the Back button is clicked", async () => {
    const mockSetStep = vi.fn();
    renderWithProviders(
      <SelectUpstreamImageSourcesForm
        selectedImages={[mockSelectedImage]}
        setSelectedImages={vi.fn()}
        setStep={mockSetStep}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(mockSetStep).toHaveBeenCalledWith(
      SelectUpstreamImagesSteps.IMAGE_SELECTION
    );
  });

  it("closes the side panel when Cancel is clicked", async () => {
    renderWithProviders(
      <SelectUpstreamImageSourcesForm
        selectedImages={[mockSelectedImage]}
        setSelectedImages={vi.fn()}
        setStep={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("submits the mutation and closes the panel on success", async () => {
    renderWithProviders(
      <SelectUpstreamImageSourcesForm
        selectedImages={[mockSelectedImage]}
        setSelectedImages={vi.fn()}
        setStep={vi.fn()}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Save and sync" })
    );
    await waitFor(() => {
      expect(imageResolvers.addSelections.resolved).toBeTruthy();
    });
    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
