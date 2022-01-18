import { mount } from "enzyme";
import { Formik } from "formik";

import TagIdField from "./TagIdField";

import type { Tag } from "app/store/tag/types";
import { tag as tagFactory } from "testing/factories";

describe("FormikField", () => {
  let tags: Tag[];

  beforeEach(() => {
    tags = [
      tagFactory({ id: 1, name: "tag1" }),
      tagFactory({ id: 2, name: "tag2" }),
    ];
  });

  it("maps the initial value to the tag format", () => {
    const wrapper = mount(
      <Formik initialValues={{ tags: [2] }} onSubmit={jest.fn()}>
        <TagIdField tagList={tags} />
      </Formik>
    );
    expect(wrapper.find("FormikField").prop("initialSelected")).toStrictEqual([
      {
        id: tags[1].id,
        name: tags[1].name,
      },
    ]);
    expect(wrapper.find("FormikField").prop("tags")).toStrictEqual([
      {
        id: tags[0].id,
        name: tags[0].name,
      },
      {
        id: tags[1].id,
        name: tags[1].name,
      },
    ]);
  });

  it("can override the field name", () => {
    const wrapper = mount(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagIdField name="wombatTags" tagList={tags} />
      </Formik>
    );
    expect(wrapper.find("FormikField").prop("name")).toBe("wombatTags");
  });

  it("can populate the list of tags", () => {
    const wrapper = mount(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagIdField tagList={tags} />
      </Formik>
    );
    expect(wrapper.find("FormikField").prop("tags")).toStrictEqual([
      {
        id: tags[0].id,
        name: tags[0].name,
      },
      {
        id: tags[1].id,
        name: tags[1].name,
      },
    ]);
  });
});
