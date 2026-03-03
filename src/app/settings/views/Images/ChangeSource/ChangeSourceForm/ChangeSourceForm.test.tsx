import { Labels } from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields/ChangeSourceFields";
import ChangeSourceForm from "@/app/settings/views/Images/ChangeSource/ChangeSourceForm/ChangeSourceForm";
import { imageSourceFactory } from "@/testing/factories";
import { userEvent, renderWithProviders, screen } from "@/testing/utils";

describe("ChangeSourceForm", () => {
  it("does not show extra fields if maas.io source is selected", async () => {
    renderWithProviders(
      <ChangeSourceForm
        autoImport={false}
        canChangeSource={true}
        errors={null}
        installType={"deb"}
        lastValidatedValues={null}
        onSubmitSource={vi.fn()}
        onValidateSource={vi.fn()}
        saved={false}
        saving={false}
        setIsValidated={vi.fn()}
        source={imageSourceFactory.build()}
        validated={false}
        validating={false}
      />
    );
    expect(
      screen.queryByRole("textbox", { name: Labels.Url })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: Labels.KeyringFilename,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: Labels.KeyringData,
      })
    ).not.toBeInTheDocument();
  });

  it("persists custom fields when switching to maas.io source", async () => {
    renderWithProviders(
      <ChangeSourceForm
        autoImport={false}
        canChangeSource={true}
        errors={null}
        installType={"deb"}
        lastValidatedValues={null}
        onSubmitSource={vi.fn()}
        onValidateSource={vi.fn()}
        saved={false}
        saving={false}
        setIsValidated={vi.fn()}
        source={imageSourceFactory.build({
          keyring_data: "data",
          keyring_filename: "/path/to/file",
          url: "http://www.example.com",
        })}
        validated={false}
        validating={false}
      />
    );
    // Switch to maas.io source and back
    await userEvent.click(screen.getByRole("radio", { name: Labels.MaasIo }));
    await userEvent.click(screen.getByRole("radio", { name: Labels.Custom }));

    expect(screen.getByRole("textbox", { name: Labels.Url })).toHaveValue(
      "http://www.example.com"
    );
  });

  it("persists autoSync value when switching between source types", async () => {
    renderWithProviders(
      <ChangeSourceForm
        autoImport={false}
        canChangeSource={true}
        errors={null}
        installType={"deb"}
        lastValidatedValues={null}
        onSubmitSource={vi.fn()}
        onValidateSource={vi.fn()}
        saved={false}
        saving={false}
        setIsValidated={vi.fn()}
        source={imageSourceFactory.build()}
        validated={false}
        validating={false}
      />
    );

    // Toggle autoSync checkbox in maas.io track
    const autoSyncCheckbox = screen.getByRole("checkbox", {
      name: Labels.AutoSyncImages,
    });
    expect(autoSyncCheckbox).not.toBeChecked();
    await userEvent.click(autoSyncCheckbox);
    expect(autoSyncCheckbox).toBeChecked();

    // Switch to custom track
    await userEvent.click(screen.getByRole("radio", { name: Labels.Custom }));

    // autoSync should persist
    expect(
      screen.getByRole("checkbox", { name: Labels.AutoSyncImages })
    ).toBeChecked();

    // Switch back to maas.io
    await userEvent.click(screen.getByRole("radio", { name: Labels.MaasIo }));

    // autoSync should still persist
    expect(
      screen.getByRole("checkbox", { name: Labels.AutoSyncImages })
    ).toBeChecked();

    // Save should be enabled because autoSync is changed
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });
});
