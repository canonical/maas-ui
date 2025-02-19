import { Formik } from "formik";

import ChangeSourceFields, {
  Labels,
} from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields/ChangeSourceFields";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import { userEvent, render, screen } from "@/testing/utils";

describe("ChangeSourceFields", () => {
  it("does not show extra fields if maas.io source is selected", async () => {
    render(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          source_type: BootResourceSourceType.MAAS_IO,
          url: "",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields />
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
    render(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          source_type: BootResourceSourceType.CUSTOM,
          url: "",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields />
      </Formik>
    );
    expect(
      screen.getByRole("textbox", { name: Labels.Url })
    ).toBeInTheDocument();
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

  it("resets fields when switching to maas.io source", async () => {
    render(
      <Formik
        initialValues={{
          keyring_data: "data",
          keyring_filename: "/path/to/file",
          source_type: BootResourceSourceType.CUSTOM,
          url: "http://www.example.com",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields />
      </Formik>
    );
    // Switch to maas.io source and back
    await userEvent.click(screen.getByRole("radio", { name: Labels.MaasIo }));
    await userEvent.click(screen.getByRole("radio", { name: Labels.Custom }));

    expect(screen.getByRole("textbox", { name: Labels.Url })).toHaveValue("");
  });

  it(`shows advanced fields when using a custom source and the "Show advanced"
    button is clicked`, async () => {
    render(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          source_type: BootResourceSourceType.CUSTOM,
          url: "",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields />
      </Formik>
    );
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

    // Click the "Show advanced" button
    await userEvent.click(
      screen.getByRole("button", {
        name: Labels.ShowAdvanced,
      })
    );

    expect(
      screen.getByRole("textbox", {
        name: Labels.KeyringFilename,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", {
        name: Labels.KeyringData,
      })
    ).toBeInTheDocument();
  });

  it("resets advanced field values when the Hide advanced button is clicked", async () => {
    render(
      <Formik
        initialValues={{
          keyring_data: "data",
          keyring_filename: "/path/to/file",
          source_type: BootResourceSourceType.CUSTOM,
          url: "http://example.com",
        }}
        onSubmit={vi.fn()}
      >
        <ChangeSourceFields />
      </Formik>
    );
    // Click the "Hide advanced" button
    await userEvent.click(
      screen.getByRole("button", {
        name: Labels.HideAdvanced,
      })
    );

    // Click the "Show advanced" button - advanced fields should've been cleared
    await userEvent.click(
      screen.getByRole("button", {
        name: Labels.ShowAdvanced,
      })
    );
    expect(screen.getByRole("textbox", { name: Labels.Url })).toHaveValue(
      "http://example.com"
    );
    expect(
      screen.getByRole("textbox", {
        name: Labels.KeyringFilename,
      })
    ).toHaveValue("");
    expect(
      screen.getByRole("textbox", {
        name: Labels.KeyringData,
      })
    ).toHaveValue("");
  });
});
