import { Formik } from "formik";

import CertificateFields, { Labels } from "./CertificateFields";

import { render, screen } from "testing/utils";

describe("CertificateFields", () => {
  it("does not render certificate and key fields if generating a certificate", () => {
    render(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <CertificateFields
          onShouldGenerateCert={jest.fn()}
          shouldGenerateCert
        />
      </Formik>
    );

    expect(
      screen.queryByRole("textbox", { name: Labels.UploadCert })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: Labels.UploadKey })
    ).not.toBeInTheDocument();
  });

  it("renders certificate and key fields if not generating a certificate", () => {
    render(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <CertificateFields
          onShouldGenerateCert={jest.fn()}
          shouldGenerateCert={false}
        />
      </Formik>
    );

    expect(
      screen.getByRole("textbox", { name: Labels.UploadCert })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: Labels.UploadKey })
    ).toBeInTheDocument();
  });

  it("can be given different field names", () => {
    render(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <CertificateFields
          onShouldGenerateCert={jest.fn()}
          privateKeyFieldName="custom-private-key"
          shouldGenerateCert={false}
        />
      </Formik>
    );

    expect(
      screen.getByRole("textbox", { name: Labels.UploadKey })
    ).toHaveAttribute("name", "custom-private-key");
  });
});
