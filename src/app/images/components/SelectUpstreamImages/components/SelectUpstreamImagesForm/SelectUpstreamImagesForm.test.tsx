import SelectUpstreamImagesForm from "./SelectUpstreamImagesForm";

import { SelectUpstreamImagesSteps } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  waitForLoading,
  within,
} from "@/testing/utils";

const mockServer = setupMockServer(
  imageResolvers.listSelections.handler(),
  imageResolvers.listAvailableSelections.handler(),
  imageResolvers.addSelections.handler(),
  imageSourceResolvers.listImageSources.handler()
);

const { mockClose } = await mockSidePanel();

const defaultProps = {
  selectedImages: [],
  setSelectedImages: vi.fn(),
  setStep: vi.fn(),
};

describe("SelectUpstreamImagesForm", () => {
  it("correctly filters selection options", async () => {
    renderWithProviders(<SelectUpstreamImagesForm {...defaultProps} />);
    await waitFor(() => {
      expect(
        screen.getByRole("row", {
          name: "24.04 LTS noble",
          hidden: true,
        })
      ).toBeInTheDocument();
    });

    const rowAvailable = within(
      screen.getByRole("row", {
        name: "24.04 LTS noble",
        hidden: true,
      })
    ).getAllByRole("combobox", { hidden: true });
    expect(rowAvailable).toHaveLength(1);
    await userEvent.click(rowAvailable[0]);
    expect(screen.getByText("arm64")).toBeInTheDocument();
    expect(screen.queryByText("amd64")).not.toBeInTheDocument();
  });

  it("advances to the source configuration step when Next is clicked after selecting an image", async () => {
    const mockSetStep = vi.fn();
    const mockSetSelectedImages = vi.fn();
    renderWithProviders(
      <SelectUpstreamImagesForm
        {...defaultProps}
        setSelectedImages={mockSetSelectedImages}
        setStep={mockSetStep}
      />
    );
    await waitFor(() => {
      expect(
        screen.getByRole("row", { name: "24.04 LTS noble", hidden: true })
      ).toBeInTheDocument();
    });

    const rowAvailable = within(
      screen.getByRole("row", { name: "24.04 LTS noble", hidden: true })
    ).getAllByRole("combobox", { hidden: true });

    await userEvent.click(rowAvailable[0]);
    expect(screen.getByText("arm64")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "arm64" }));
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(mockSetStep).toHaveBeenCalledWith(
        SelectUpstreamImagesSteps.SOURCE_CONFIGURATION
      );
    });
    expect(mockSetSelectedImages).toHaveBeenCalled();
  });

  it("shows a loading spinner while data is being fetched", () => {
    renderWithProviders(<SelectUpstreamImagesForm {...defaultProps} />);
    // Spinner is visible synchronously on mount before MSW responds
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows a warning notification when no upstream images are available", async () => {
    mockServer.use(
      imageResolvers.listAvailableSelections.handler({ items: [] })
    );
    renderWithProviders(<SelectUpstreamImagesForm {...defaultProps} />);
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByText(/no available upstream images/i)
      ).toBeInTheDocument();
    });
  });

  it("filters the image list by release codename when a search query is entered", async () => {
    // Clear prior selections so all available images are displayed
    mockServer.use(
      imageResolvers.listSelections.handler({ items: [], total: 0 })
    );
    renderWithProviders(<SelectUpstreamImagesForm {...defaultProps} />);
    await waitForLoading();

    await userEvent.type(screen.getByRole("searchbox"), "noble");

    await waitFor(() => {
      expect(
        screen.getByRole("row", { name: "24.04 LTS noble", hidden: true })
      ).toBeInTheDocument();
    });
    // "22.04 LTS jammy" row should be hidden after filtering for "noble"
    expect(
      screen.queryByRole("row", { name: "22.04 LTS jammy", hidden: true })
    ).not.toBeInTheDocument();
  });

  it("filters the image list by OS name when a search query is entered", async () => {
    // Clear prior selections so all available images are displayed
    mockServer.use(
      imageResolvers.listSelections.handler({ items: [], total: 0 })
    );
    renderWithProviders(<SelectUpstreamImagesForm {...defaultProps} />);
    await waitForLoading();

    await userEvent.type(screen.getByRole("searchbox"), "centos");

    await waitFor(() => {
      // The CentOS accordion section title should be visible
      expect(screen.getByText("CentOS")).toBeInTheDocument();
    });
    // The Ubuntu accordion section title should be hidden
    expect(screen.queryByText("Ubuntu")).not.toBeInTheDocument();
  });

  it("closes the side panel when Cancel is clicked", async () => {
    renderWithProviders(<SelectUpstreamImagesForm {...defaultProps} />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });
});
