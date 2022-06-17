import { Textarea } from "@canonical/react-components";
import { mount } from "enzyme";
import { Formik } from "formik";

import FormikField from "./FormikField";

describe("FormikField", () => {
  it("can render", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikField
          help="Required."
          id="username"
          label="Username"
          name="username"
          required={true}
          type="text"
        />
      </Formik>
    );
    expect(wrapper.find("FormikField")).toMatchSnapshot();
  });

  it("can set a different component", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikField component={Textarea} name="username" />
      </Formik>
    );
    expect(wrapper.find("Textarea").exists()).toBe(true);
  });

  it("can pass errors", () => {
    const wrapper = mount(
      <Formik
        initialErrors={{ username: "Uh oh!" }}
        initialTouched={{ username: true }}
        initialValues={{ username: "" }}
        onSubmit={jest.fn()}
      >
        <FormikField name="username" />
      </Formik>
    );
    expect(wrapper.find("Input").prop("error")).toBe("Uh oh!");
  });

  it("can hide the errors", () => {
    const wrapper = mount(
      <Formik
        initialErrors={{ username: "Uh oh!" }}
        initialTouched={{ username: true }}
        initialValues={{ username: "" }}
        onSubmit={jest.fn()}
      >
        <FormikField displayError={false} name="username" />
      </Formik>
    );
    expect(wrapper.find("Input").prop("error")).toBe(null);
  });
});
