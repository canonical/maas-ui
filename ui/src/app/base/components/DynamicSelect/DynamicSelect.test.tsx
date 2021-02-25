import { mount } from "enzyme";
import { Formik } from "formik";

import DynamicSelect from "./DynamicSelect";
import type { Props as DynamicSelectProps } from "./DynamicSelect";

import { waitForComponentToPaint } from "testing/utils";

describe("DynamicSelect", () => {
  it("resets to the first option if the value changes to something unknown", async () => {
    const wrapper = mount(
      <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
        <DynamicSelect
          name="fabric"
          options={[
            { label: "one", value: "1" },
            { label: "two", value: "2" },
          ]}
        />
      </Formik>
    );
    expect(wrapper.find("FormikField select").prop("value")).toBe("1");
    wrapper.find("FormikField select").simulate("change", {
      target: {
        name: "fabric",
        value: "2",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe("2");
    wrapper.find("FormikField select").simulate("change", {
      target: {
        name: "fabric",
        value: "99999",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe("1");
  });

  it("resets to the first option if the options change and the value no longer exists", async () => {
    // Create a mock component so that setProps can pass props past the Formik wrapper.
    const MockComponent = (props: DynamicSelectProps) => (
      <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
        <DynamicSelect {...props} />
      </Formik>
    );
    const wrapper = mount(
      <MockComponent
        name="fabric"
        options={[
          { label: "one", value: "1" },
          { label: "two", value: "2" },
        ]}
      />
    );
    wrapper.find("FormikField select").simulate("change", {
      target: {
        name: "fabric",
        value: "2",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe("2");
    wrapper.setProps({
      options: [
        { label: "three", value: "3" },
        { label: "four", value: "4" },
      ],
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe("3");
  });

  it("doesn't change the value if the options change and the value still exists", async () => {
    const wrapper = mount(
      <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
        <DynamicSelect
          name="fabric"
          options={[
            { label: "one", value: "1" },
            { label: "two", value: "2" },
          ]}
        />
      </Formik>
    );
    wrapper.find("FormikField select").simulate("change", {
      target: {
        name: "fabric",
        value: "2",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe("2");
    wrapper.setProps({
      options: [
        { label: "three", value: "3" },
        { label: "two", value: "2" },
      ],
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe("2");
  });

  it("accepts changing to a value that is a number", async () => {
    // Create a mock component so that setProps can pass props past the Formik wrapper.
    const MockComponent = (props: DynamicSelectProps) => (
      <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
        <DynamicSelect {...props} />
      </Formik>
    );
    const wrapper = mount(
      <MockComponent
        name="fabric"
        options={[
          { label: "one", value: "1" },
          { label: "two", value: "2" },
        ]}
      />
    );
    wrapper.find("FormikField select").simulate("change", {
      target: {
        name: "fabric",
        value: 2,
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe(2);
    wrapper.setProps({
      options: [
        { label: "three", value: "3" },
        { label: "two", value: "2" },
      ],
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe(2);
  });

  it("accepts updated values that are numbers", async () => {
    // Create a mock component so that setProps can pass props past the Formik wrapper.
    const MockComponent = (props: DynamicSelectProps) => (
      <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
        <DynamicSelect {...props} />
      </Formik>
    );
    const wrapper = mount(
      <MockComponent
        name="fabric"
        options={[
          { label: "one", value: "1" },
          { label: "two", value: "2" },
        ]}
      />
    );
    wrapper.find("FormikField select").simulate("change", {
      target: {
        name: "fabric",
        value: "2",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe("2");
    wrapper.setProps({
      options: [
        { label: "three", value: 3 },
        { label: "two", value: 2 },
      ],
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField select").prop("value")).toBe("2");
  });
});
