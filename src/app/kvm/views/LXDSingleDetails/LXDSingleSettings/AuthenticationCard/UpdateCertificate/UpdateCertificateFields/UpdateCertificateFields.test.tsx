import { Formik } from "formik";

import UpdateCertificateFields from "./UpdateCertificateFields";

import { generatedCertificate as generatedCertificateFactory } from "testing/factories";
import { render, screen, waitFor } from "testing/utils";

describe("UpdateCertificateFields", () => {
  it("shows authentication fields if no certificate provided", async () => {
    render(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <UpdateCertificateFields
          generatedCertificate={null}
          setShouldGenerateCert={jest.fn()}
          shouldGenerateCert
        />
      </Formik>
    );
    await waitFor(() =>
      expect(screen.getByTestId("generate-certificate")).toBeInTheDocument()
    );
    expect(screen.queryByTestId("certificate-data")).not.toBeInTheDocument();
  });

  it("shows certificate data if certificate provided", () => {
    const generatedCertificate = generatedCertificateFactory();
    render(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <UpdateCertificateFields
          generatedCertificate={generatedCertificate}
          setShouldGenerateCert={jest.fn()}
          shouldGenerateCert
        />
      </Formik>
    );
    expect(screen.getByTestId("certificate-data")).toBeInTheDocument();
    expect(
      screen.queryByTestId("generate-certificate")
    ).not.toBeInTheDocument();
  });
});
