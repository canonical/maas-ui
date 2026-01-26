import UploadCustomImage from "./UploadCustomImage";

import { imageResolvers } from "@/testing/resolvers/images";
import {
  userEvent,
  screen,
  mockSidePanel,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
  waitFor,
  fireEvent,
} from "@/testing/utils";

const { mockClose } = await mockSidePanel();
const mockServer = setupMockServer(imageResolvers.uploadCustomImage.handler());

describe("UploadCustomImage", () => {
  it("calls closeForm on cancel click", async () => {
    renderWithProviders(<UploadCustomImage />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls upload images on save click", async () => {
    renderWithProviders(<UploadCustomImage />);
    await waitForLoading();

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /operating system/i }),
      "Ubuntu"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /release title/i }),
      "24.04 LTS"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /release codename/i }),
      "noble"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /architecture/i }),
      "amd64"
    );
    const file = new File(["dummy content"], "test-image.tgz", {
      type: "application/octet-stream",
    });
    const fileInput = screen.getByRole("button", {
      name: "Drag and drop files here or click to upload",
    });
    fireEvent.drop(fileInput, {
      dataTransfer: {
        files: [file],
      },
    });

    await userEvent.click(screen.getByRole("button", { name: "Upload" }));
    await waitFor(() => {
      expect(imageResolvers.uploadCustomImage.resolved).toBeTruthy();
    });
  });

  it("displays error messages when image upload fails", async () => {
    mockServer.use(
      imageResolvers.uploadCustomImage.error({ code: 400, message: "Uh oh!" })
    );
    renderWithProviders(<UploadCustomImage />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Upload" }));
    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
