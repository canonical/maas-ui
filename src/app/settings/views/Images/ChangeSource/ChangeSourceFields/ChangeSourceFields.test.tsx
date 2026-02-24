import { Formik } from "formik";

import {
  MAAS_IO_DEFAULT_KEYRING_FILE_PATHS,
  MAAS_IO_URLS,
} from "@/app/images/constants";
import { BootResourceSourceType } from "@/app/images/types";
import ChangeSourceFields, {
  Labels,
} from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields/ChangeSourceFields";
import { userEvent, renderWithProviders, screen } from "@/testing/utils";

describe("ChangeSourceFields", () => {
  it("does not show extra fields if maas.io source is selected", async () => {
    renderWithProviders(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.MAAS_IO,
          url: "",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
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

  it("shows url fields if custom source is selected", async () => {
    renderWithProviders(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.CUSTOM,
          url: "",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
    );
    expect(
      screen.getByRole("textbox", { name: Labels.Url })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Contents of GPG key (base64 encoded)")
    ).not.toBeInTheDocument();
  });

  it("persists custom fields when switching to maas.io source", async () => {
    renderWithProviders(
      <Formik
        initialValues={{
          keyring_data: "data",
          keyring_filename: "/path/to/file",
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.CUSTOM,
          url: "http://www.example.com",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
    );
    // Switch to maas.io source and back
    await userEvent.click(screen.getByRole("radio", { name: Labels.MaasIo }));
    await userEvent.click(screen.getByRole("radio", { name: Labels.Custom }));

    expect(screen.getByRole("textbox", { name: Labels.Url })).toHaveValue(
      "http://www.example.com"
    );
  });

  it("switches between keyring filename and keyring data fields when selecting different options", async () => {
    renderWithProviders(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.CUSTOM,
          url: "",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
    );
    expect(
      screen.getByPlaceholderText(
        "e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Contents of GPG key (base64 encoded)")
    ).not.toBeInTheDocument();

    // Switch to keyring_data
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_data");

    expect(
      screen.queryByPlaceholderText(
        "e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
      )
    ).not.toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Contents of GPG key (base64 encoded)")
    ).toBeInTheDocument();
  });

  it("clears the other field when switching between keyring types", async () => {
    renderWithProviders(
      <Formik
        initialValues={{
          keyring_data: "some data",
          keyring_filename: "/path/to/file",
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.CUSTOM,
          url: "http://example.com",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
    );

    expect(
      screen.getByPlaceholderText(
        "e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
      )
    ).toHaveValue("/path/to/file");

    // Switch to keyring_data
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "keyring_data");

    // keyring_data should be shown with its value
    expect(
      screen.getByPlaceholderText("Contents of GPG key (base64 encoded)")
    ).toHaveValue("some data");

    // Switch back to keyring_filename
    await userEvent.selectOptions(select, "keyring_filename");

    // URL should still have its value
    expect(screen.getByRole("textbox", { name: Labels.Url })).toHaveValue(
      "http://example.com"
    );
  });

  it("pre-populates MAAS.io stream selector with correct channel from URL", async () => {
    const { rerender } = renderWithProviders(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb,
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.MAAS_IO,
          url: MAAS_IO_URLS.candidate,
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
    );

    // Verify the stream selector is set to candidate
    const streamSelect = screen.getByRole("combobox", { name: "Stream" });
    expect(streamSelect).toHaveValue("candidate");

    // Switch to stable URL and verify the selector updates
    rerender(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb,
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.MAAS_IO,
          url: MAAS_IO_URLS.stable,
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
    );

    const stableStreamSelect = screen.getByRole("combobox", {
      name: "Stream",
    });
    expect(stableStreamSelect).toHaveValue("stable");
  });

  it("pre-populates custom source with correct default keyring based on install type", async () => {
    // Test with deb install type
    const { rerender } = renderWithProviders(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb,
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.CUSTOM,
          url: "http://custom.example.com/stable/",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
    );

    // Verify deb default keyring is shown
    expect(
      screen.getByPlaceholderText(
        "e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
      )
    ).toHaveValue(MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb);

    // Test with snap install type
    rerender(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.snap,
          keyring_type: "keyring_filename",
          source_type: BootResourceSourceType.CUSTOM,
          url: "http://custom.example.com/stable/",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields saved={false} saving={false} />
      </Formik>
    );

    // Verify snap default keyring is shown
    expect(
      screen.getByPlaceholderText(
        "e.g. /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg"
      )
    ).toHaveValue(MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.snap);
  });
});
