import { MAAS_IO_DEFAULT_KEYRING_FILE_PATHS } from "@/app/images/constants";
import type { ChangeSourceValues } from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { Labels } from "@/app/settings/views/Images/ChangeSource/ChangeSourceForm/ChangeSourceForm";
import CustomSourceForm from "@/app/settings/views/Images/ChangeSource/ChangeSourceForm/CustomSourceForm/CustomSourceForm";
import { userEvent, renderWithProviders, screen } from "@/testing/utils";

describe("CustomSourceForm", () => {
  it("shows url fields if custom source is selected", async () => {
    const initialValues: ChangeSourceValues = {
      keyring_data: "",
      keyring_filename: "",
      keyring_type: "keyring_filename",
      url: "",
      priority: 0,
      autoSync: false,
    };

    renderWithProviders(
      <CustomSourceForm
        enabled={false}
        errors={null}
        initialValues={initialValues}
        onSubmit={vi.fn()}
        onValidate={vi.fn()}
        onValuesChanged={vi.fn()}
        saved={false}
        saving={false}
        serverValues={initialValues}
        validated={false}
        validating={false}
      />
    );

    expect(
      screen.getByRole("textbox", { name: Labels.Url })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: Labels.KeyringFilename })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: Labels.KeyringData })
    ).not.toBeInTheDocument();
  });

  it("switches between keyring filename and keyring data fields when selecting different options", async () => {
    const initialValues: ChangeSourceValues = {
      keyring_data: "",
      keyring_filename: "",
      keyring_type: "keyring_filename",
      url: "",
      priority: 0,
      autoSync: false,
    };

    renderWithProviders(
      <CustomSourceForm
        enabled={false}
        errors={null}
        initialValues={initialValues}
        onSubmit={vi.fn()}
        onValidate={vi.fn()}
        onValuesChanged={vi.fn()}
        saved={false}
        saving={false}
        serverValues={initialValues}
        validated={false}
        validating={false}
      />
    );

    expect(
      screen.getByRole("textbox", { name: Labels.KeyringFilename })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: Labels.KeyringData })
    ).not.toBeInTheDocument();

    // Switch to keyring_data
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_data");

    expect(
      screen.queryByRole("textbox", { name: Labels.KeyringFilename })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: Labels.KeyringData })
    ).toBeInTheDocument();
  });

  it("clears the other field when switching between keyring types", async () => {
    const initialValues: ChangeSourceValues = {
      keyring_data: "some data",
      keyring_filename: "/path/to/file",
      keyring_type: "keyring_filename",
      url: "http://example.com",
      priority: 0,
      autoSync: false,
    };

    renderWithProviders(
      <CustomSourceForm
        enabled={false}
        errors={null}
        initialValues={initialValues}
        onSubmit={vi.fn()}
        onValidate={vi.fn()}
        onValuesChanged={vi.fn()}
        saved={false}
        saving={false}
        serverValues={initialValues}
        validated={false}
        validating={false}
      />
    );

    expect(
      screen.getByRole("textbox", { name: Labels.KeyringFilename })
    ).toHaveValue("/path/to/file");

    // Switch to keyring_data
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_data");

    // keyring_data should be shown with its value
    expect(
      screen.getByRole("textbox", { name: Labels.KeyringData })
    ).toHaveValue("some data");

    // Switch back to keyring_filename
    await userEvent.selectOptions(select, "keyring_filename");

    // URL should still have its value
    expect(screen.getByRole("textbox", { name: Labels.Url })).toHaveValue(
      "http://example.com"
    );
  });

  it("pre-populates custom source with correct default keyring based on install type", async () => {
    const debInitialValues: ChangeSourceValues = {
      keyring_data: "",
      keyring_filename: MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb,
      keyring_type: "keyring_filename",
      url: "http://custom.example.com/stable/",
      priority: 0,
      autoSync: false,
    };

    // Test with deb install type
    const { rerender } = renderWithProviders(
      <CustomSourceForm
        enabled={false}
        errors={null}
        initialValues={debInitialValues}
        onSubmit={vi.fn()}
        onValidate={vi.fn()}
        onValuesChanged={vi.fn()}
        saved={false}
        saving={false}
        serverValues={debInitialValues}
        validated={false}
        validating={false}
      />
    );

    // Verify deb default keyring is shown
    expect(
      screen.getByRole("textbox", { name: Labels.KeyringFilename })
    ).toHaveValue(MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb);

    // Test with snap install type
    const snapInitialValues: ChangeSourceValues = {
      keyring_data: "",
      keyring_filename: MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.snap,
      keyring_type: "keyring_filename",
      url: "http://custom.example.com/stable/",
      priority: 0,
      autoSync: false,
    };

    rerender(
      <CustomSourceForm
        enabled={false}
        errors={null}
        initialValues={snapInitialValues}
        onSubmit={vi.fn()}
        onValidate={vi.fn()}
        onValuesChanged={vi.fn()}
        saved={false}
        saving={false}
        serverValues={snapInitialValues}
        validated={false}
        validating={false}
      />
    );

    // Verify snap default keyring is shown
    expect(
      screen.getByRole("textbox", { name: Labels.KeyringFilename })
    ).toHaveValue(MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.snap);
  });
});
