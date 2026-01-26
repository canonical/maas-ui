import { Formik } from "formik";

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
});
