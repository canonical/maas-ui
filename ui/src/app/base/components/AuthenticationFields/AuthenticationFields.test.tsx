import { mount } from "enzyme";
import { Formik } from "formik";

import AuthenticationFields from "./AuthenticationFields";

describe("AuthenticationFields", () => {
  it("renders password field if generating a certificate", () => {
    const wrapper = mount(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <AuthenticationFields
          onShouldGenerateCert={jest.fn()}
          shouldGenerateCert
        />
      </Formik>
    );
    expect(wrapper.find("input[name='password']").exists()).toBe(true);
    expect(wrapper.find("textarea[name='certificate']").exists()).toBe(false);
    expect(wrapper.find("textarea[name='key']").exists()).toBe(false);
  });

  it("can choose not to render the password field when generating certificate", () => {
    const wrapper = mount(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <AuthenticationFields
          onShouldGenerateCert={jest.fn()}
          shouldGenerateCert
          showPassword={false}
        />
      </Formik>
    );
    expect(wrapper.find("input[name='password']").exists()).toBe(false);
    expect(wrapper.find("textarea[name='certificate']").exists()).toBe(false);
    expect(wrapper.find("textarea[name='key']").exists()).toBe(false);
  });

  it("renders certificate and key fields if not generating a certificate", () => {
    const wrapper = mount(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <AuthenticationFields
          onShouldGenerateCert={jest.fn()}
          shouldGenerateCert={false}
        />
      </Formik>
    );
    expect(wrapper.find("input[name='password']").exists()).toBe(false);
    expect(wrapper.find("textarea[name='certificate']").exists()).toBe(true);
    expect(wrapper.find("textarea[name='key']").exists()).toBe(true);
  });

  it("can be given different field names", () => {
    const wrapper = mount(
      <Formik
        initialValues={{ certificate: "", key: "", password: "" }}
        onSubmit={jest.fn()}
      >
        <AuthenticationFields
          onShouldGenerateCert={jest.fn()}
          passwordValueName="trust_password"
          shouldGenerateCert
        />
      </Formik>
    );
    expect(wrapper.find("input[name='trust_password']").exists()).toBe(true);
  });
});
