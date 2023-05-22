import { render } from "@testing-library/react";
import { Formik } from "formik";

import TagIdField from "./TagIdField";

import type { Tag } from "app/store/tag/types";
import { tag as tagFactory } from "testing/factories";
import { screen } from "testing/utils";

describe("TagIdField", () => {
  let tags: Tag[];

  beforeEach(() => {
    tags = [
      tagFactory({ id: 1, name: "tag1" }),
      tagFactory({ id: 2, name: "tag2" }),
    ];
  });

  it("maps the initial value to the tag format", () => {
    render(
      <Formik initialValues={{ tags: [2] }} onSubmit={jest.fn()}>
        <TagIdField tagList={tags} />
      </Formik>
    );

    const field = screen.getByTestId("TagIdField");
    expect(field.initialSelected).toStrictEqual([
      {
        id: tags[1].id,
        name: tags[1].name,
      },
    ]);
    expect(field.tags).toStrictEqual([
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
    render(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagIdField name="wombatTags" tagList={tags} />
      </Formik>
    );

    const field = screen.getByTestId("TagIdField");
    expect(field.name).toBe("wombatTags");
  });

  it("can populate the list of tags", () => {
    render(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagIdField tagList={tags} />
      </Formik>
    );
    const field = screen.getByTestId("TagIdField");
    expect(field.tags).toStrictEqual([
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
