import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import FetchImagesFormFields, {
  Labels as FetchImagesFormFieldsLabels,
} from "./FetchImagesFormFields";

import { BootResourceSourceType } from "app/store/bootresource/types";
import { render, screen } from "testing/utils";

describe("FetchImagesFormFields", () => {
  it("does not show extra fields if maas.io source is selected", async () => {
    render(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          source_type: BootResourceSourceType.MAAS_IO,
          url: "",
        }}
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    expect(
      screen.queryByRole("textbox", { name: FetchImagesFormFieldsLabels.Url })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringFilename,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringData,
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
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    expect(
      screen.getByRole("textbox", { name: FetchImagesFormFieldsLabels.Url })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringFilename,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringData,
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
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    // Switch to maas.io source and back
    await userEvent.click(
      screen.getByRole("radio", { name: FetchImagesFormFieldsLabels.MaasIo })
    );
    await userEvent.click(
      screen.getByRole("radio", { name: FetchImagesFormFieldsLabels.Custom })
    );

    expect(
      screen.getByRole("textbox", { name: FetchImagesFormFieldsLabels.Url })
    ).toHaveValue("");
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
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    expect(
      screen.queryByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringFilename,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringData,
      })
    ).not.toBeInTheDocument();

    // Click the "Show advanced" button
    await userEvent.click(
      screen.getByRole("button", {
        name: FetchImagesFormFieldsLabels.ShowAdvanced,
      })
    );

    expect(
      screen.getByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringFilename,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringData,
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
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    // Click the "Hide advanced" button
    await userEvent.click(
      screen.getByRole("button", {
        name: FetchImagesFormFieldsLabels.HideAdvanced,
      })
    );

    // Click the "Show advanced" button - advanced fields should've been cleared
    await userEvent.click(
      screen.getByRole("button", {
        name: FetchImagesFormFieldsLabels.ShowAdvanced,
      })
    );
    expect(
      screen.getByRole("textbox", { name: FetchImagesFormFieldsLabels.Url })
    ).toHaveValue("http://example.com");
    expect(
      screen.getByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringFilename,
      })
    ).toHaveValue("");
    expect(
      screen.getByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringData,
      })
    ).toHaveValue("");
  });
});
