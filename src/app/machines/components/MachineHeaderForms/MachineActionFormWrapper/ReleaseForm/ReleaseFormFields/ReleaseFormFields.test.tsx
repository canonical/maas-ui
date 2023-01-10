import { mount } from "enzyme";
import { Formik } from "formik";

import ReleaseFormFields from "./ReleaseFormFields";

describe("ReleaseFormFields", () => {
  it("enables checkboxes for quick/secure erase if erasing is enabled", () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          enableErase: true,
          quickErase: false,
          secureErase: false,
        }}
        onSubmit={jest.fn()}
      >
        <ReleaseFormFields />
      </Formik>
    );

    expect(wrapper.find("input[name='quickErase']").prop("disabled")).toBe(
      false
    );
    expect(wrapper.find("input[name='secureErase']").prop("disabled")).toBe(
      false
    );
  });

  it("disables checkboxes for quick/secure erase if erasing is disabled", () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          enableErase: false,
          quickErase: false,
          secureErase: false,
        }}
        onSubmit={jest.fn()}
      >
        <ReleaseFormFields />
      </Formik>
    );

    expect(wrapper.find("input[name='quickErase']").prop("disabled")).toBe(
      true
    );
    expect(wrapper.find("input[name='secureErase']").prop("disabled")).toBe(
      true
    );
  });
});
