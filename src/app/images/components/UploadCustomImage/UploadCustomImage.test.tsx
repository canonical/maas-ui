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
} from "@/testing/utils";

const { mockClose } = await mockSidePanel();
const mockServer = setupMockServer(imageResolvers.uploadCustomImage.handler());

// Mock File.prototype.arrayBuffer for tests
if (!File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function () {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(this);
    });
  };
}

// Mock File.prototype.stream for MSW
if (!File.prototype.stream) {
  File.prototype.stream = function () {
    // Return a mock ReadableStream
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([]));
        controller.close();
      },
    }) as unknown as ReadableStream;
  };
}

describe("UploadCustomImage", () => {
  it("calls closeForm on cancel click", async () => {
    renderWithProviders(<UploadCustomImage />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls upload images on save click", async () => {
    const { result } = renderWithProviders(<UploadCustomImage />);
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
    const fileInput = result.container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    await userEvent.click(screen.getByRole("button", { name: "Upload" }));
    await waitFor(() => {
      expect(imageResolvers.uploadCustomImage.resolved).toBeTruthy();
    });
  });

  it("displays error messages when image upload fails", async () => {
    mockServer.use(
      imageResolvers.uploadCustomImage.error({ code: 400, message: "Uh oh!" })
    );
    const { result } = renderWithProviders(<UploadCustomImage />);
    await waitForLoading();

    // Fill in all required fields to enable the Upload button
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
    const fileInput = result.container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    await userEvent.click(screen.getByRole("button", { name: "Upload" }));
    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
