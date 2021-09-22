import { mount } from "enzyme";
import { Formik } from "formik";

import LXDPowerFields from "./LXDPowerFields";

import { powerField as powerFieldFactory } from "testing/factories";

describe("LXDPowerFields", () => {
  it("can be disabled", () => {
    const field = powerFieldFactory({ name: "field" });
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LXDPowerFields disabled fields={[field]} />
      </Formik>
    );
    expect(
      wrapper.find("input[name='power_parameters.field']").prop("disabled")
    ).toBe(true);
  });

  it("can be given a custom power parameters name", () => {
    const field = powerFieldFactory({ name: "field" });
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LXDPowerFields
          disabled
          fields={[field]}
          powerParametersValueName="custom-power-parameters"
        />
      </Formik>
    );
    expect(
      wrapper.find("input[name='custom-power-parameters.field']").exists()
    ).toBe(true);
  });

  it("renders certificate data if being used for configuration", () => {
    const field = powerFieldFactory({ name: "field" });
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LXDPowerFields disabled fields={[field]} forConfiguration />
      </Formik>
    );
    expect(wrapper.find("[data-test='certificate-data']").exists()).toBe(true);
    expect(wrapper.find("AuthenticationFields").exists()).toBe(false);
  });

  it("renders authentication fields if not being used for configuration", () => {
    const field = powerFieldFactory({ name: "field" });
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LXDPowerFields disabled fields={[field]} forConfiguration={false} />
      </Formik>
    );
    expect(wrapper.find("[data-test='certificate-data']").exists()).toBe(false);
    expect(wrapper.find("AuthenticationFields").exists()).toBe(true);
  });
});
