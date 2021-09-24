import { mount } from "enzyme";
import { Formik } from "formik";

import CertificateFields from "./CertificateFields";

describe("CertificateFields", () => {
  it("does not render certificate and key fields if generating a certificate", () => {
    const wrapper = mount(
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
    expect(wrapper.find("textarea[name='certificate']").exists()).toBe(false);
    expect(wrapper.find("textarea[name='key']").exists()).toBe(false);
  });

  it("renders certificate and key fields if not generating a certificate", () => {
    const wrapper = mount(
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
    expect(wrapper.find("textarea[name='certificate']").exists()).toBe(true);
    expect(wrapper.find("textarea[name='key']").exists()).toBe(true);
  });

  it("can be given different field names", () => {
    const wrapper = mount(
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
    expect(wrapper.find("textarea[name='custom-private-key']").exists()).toBe(
      true
    );
  });
});
