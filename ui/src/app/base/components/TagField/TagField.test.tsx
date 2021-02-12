import { mount } from "enzyme";
import { Formik } from "formik";

import TagField from "./TagField";

describe("FormikField", () => {
  it("maps the initial value to the tag format", () => {
    const wrapper = mount(
      <Formik
        initialValues={{ tags: ["koala", "wallaby"] }}
        onSubmit={jest.fn()}
      >
        <TagField />
      </Formik>
    );
    expect(wrapper.find("FormikField").prop("initialSelected")).toStrictEqual([
      {
        name: "koala",
      },
      {
        name: "wallaby",
      },
    ]);
    expect(wrapper.find("FormikField").prop("tags")).toStrictEqual([
      {
        name: "koala",
      },
      {
        name: "wallaby",
      },
    ]);
  });

  it("can override the field name", () => {
    const wrapper = mount(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagField name="wombatTags" />
      </Formik>
    );
    expect(wrapper.find("FormikField").prop("name")).toBe("wombatTags");
  });

  it("can populate the list of tags", () => {
    const wrapper = mount(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagField tagList={["koala", "wallaby"]} />
      </Formik>
    );
    expect(wrapper.find("FormikField").prop("tags")).toStrictEqual([
      {
        name: "koala",
      },
      {
        name: "wallaby",
      },
    ]);
  });
});
