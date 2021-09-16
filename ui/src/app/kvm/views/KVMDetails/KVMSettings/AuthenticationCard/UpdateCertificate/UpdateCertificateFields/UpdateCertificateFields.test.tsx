import { mount } from "enzyme";
import { Formik } from "formik";

import UpdateCertificateFields from "./UpdateCertificateFields";

import { generatedCertificate as generatedCertificateFactory } from "testing/factories";

describe("UpdateCertificateFields", () => {
  it("shows authentication fields if no certificate provided", () => {
    const wrapper = mount(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <UpdateCertificateFields
          generatedCertificate={null}
          shouldGenerateCert
          setShouldGenerateCert={jest.fn()}
        />
      </Formik>
    );
    expect(wrapper.find("[data-test='authentication-fields']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-test='certificate-data']").exists()).toBe(false);
  });

  it("shows certificate data if certificate provided", () => {
    const generatedCertificate = generatedCertificateFactory();
    const wrapper = mount(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <UpdateCertificateFields
          generatedCertificate={generatedCertificate}
          shouldGenerateCert
          setShouldGenerateCert={jest.fn()}
        />
      </Formik>
    );
    expect(wrapper.find("[data-test='certificate-data']").exists()).toBe(true);
    expect(wrapper.find("[data-test='authentication-fields']").exists()).toBe(
      false
    );
  });
});
