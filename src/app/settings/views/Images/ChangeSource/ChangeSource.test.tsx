import { describe, it, expect } from "vitest";

import ChangeSource from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { Labels } from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields/ChangeSourceFields";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  imageSourceResolvers.listImageSources.handler(),
  imageSourceResolvers.getImageSource.handler(),
  imageSourceResolvers.fetchImageSource.handler(),
  imageSourceResolvers.createImageSource.handler(),
  imageSourceResolvers.updateImageSource.handler(),
  imageSourceResolvers.deleteImageSource.handler(),
  imageResolvers.listSelectionStatuses.handler(),
  imageResolvers.listCustomImageStatuses.handler(),
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
    value: true,
  }),
  configurationsResolvers.setConfiguration.handler()
);

describe("ChangeSource", () => {
  it("dispatches an action to update config when changing the auto sync switch", async () => {
    renderWithProviders(<ChangeSource />);
    await waitForLoading();
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Automatically sync images/i })
    );
    await userEvent.click(screen.getByRole("button", { name: "Validate" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(configurationsResolvers.setConfiguration.resolved).toBe(true);
  });

  it("disables the button to change source if resources are downloading", async () => {
    mockServer.use(
      imageResolvers.listSelectionStatuses.handler({
        items: [factory.imageStatusFactory.build({ status: "Downloading" })],
        total: 1,
      })
    );
    renderWithProviders(<ChangeSource />);
    await waitForLoading();
    expect(screen.getByRole("button", { name: "Validate" })).toBeAriaDisabled();
    expect(
      screen.getByTestId("cannot-change-source-warning")
    ).toBeInTheDocument();
  });

  it("does not display keyring fields when unsigned keyring type is selected", async () => {
    renderWithProviders(<ChangeSource />);
    await waitForLoading();

    await userEvent.click(screen.getByRole("radio", { name: Labels.Custom }));

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_unsigned");

    expect(
      screen.getByRole("textbox", { name: Labels.Url })
    ).toBeInTheDocument();

    expect(
      screen.queryByPlaceholderText(
        "e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Contents of GPG key (base64 encoded)")
    ).not.toBeInTheDocument();
  });

  it("shows error when keyring_filename is empty and keyring_type is keyring_filename", async () => {
    renderWithProviders(<ChangeSource />);
    await waitForLoading();

    await userEvent.click(screen.getByRole("radio", { name: Labels.Custom }));

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_filename");

    // Focus and blur the keyring filename field to trigger validation
    const keyringFilenameInput = screen.getByPlaceholderText(
      "e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
    );
    await userEvent.click(keyringFilenameInput);
    await userEvent.tab();

    await waitFor(() => {
      expect(
        screen.getByText("Keyring filename is required")
      ).toBeInTheDocument();
    });
  });

  it("shows error when keyring_data is empty and keyring_type is keyring_data", async () => {
    renderWithProviders(<ChangeSource />);
    await waitForLoading();

    await userEvent.click(screen.getByRole("radio", { name: Labels.Custom }));

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_data");

    // Focus and blur the keyring data field to trigger validation
    const keyringDataInput = screen.getByPlaceholderText(
      "Contents of GPG key (base64 encoded)"
    );
    await userEvent.click(keyringDataInput);
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText("Keyring data is required")).toBeInTheDocument();
    });
  });

  it("creates a new source and deletes the old one when URL is changed", async () => {
    renderWithProviders(<ChangeSource />);
    await waitForLoading();

    // Change to custom source
    await userEvent.click(screen.getByRole("radio", { name: Labels.Custom }));

    // Update the URL
    const urlInput = screen.getByRole("textbox", { name: Labels.Url });
    await userEvent.clear(urlInput);
    await userEvent.type(urlInput, "http://example.com/ephemeral-v3/stable/");

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_unsigned");

    const validateButton = screen.getByRole("button", { name: "Validate" });
    await userEvent.click(validateButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(imageSourceResolvers.createImageSource.resolved).toBe(true);
    });
  });

  it("updates existing source when URL is unchanged", async () => {
    mockServer.use(
      imageSourceResolvers.getImageSource.handler(
        factory.imageSourceFactory.build({
          id: 1,
          url: "http://custom.example.com/ephemeral-v3/stable/",
          keyring_filename: "/path/to/keyring.gpg",
          keyring_data: "",
          priority: 0,
          skip_keyring_verification: false,
        })
      )
    );

    renderWithProviders(<ChangeSource />);
    await waitForLoading();

    // Change keyring type to keyring_data (different from initial keyring_filename)
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_data");

    const keyringDataInput = screen.getByPlaceholderText(
      "Contents of GPG key (base64 encoded)"
    );
    await userEvent.type(keyringDataInput, "aabbccdd");

    await userEvent.click(screen.getByRole("button", { name: "Validate" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(imageSourceResolvers.updateImageSource.resolved).toBe(true);
    });
  });
});
