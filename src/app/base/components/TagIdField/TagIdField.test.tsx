import { Formik } from "formik";

import TagIdField from "./TagIdField";

import type { Tag } from "app/store/tag/types";
import { tag as tagFactory } from "testing/factories";
import { screen, render, userEvent } from "testing/utils";

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

    expect(screen.getByRole("button", { name: "tag2" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "tag1" })
    ).not.toBeInTheDocument();
  });

  it("can override the field name", () => {
    render(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagIdField name="wombatTags" tagList={tags} />
      </Formik>
    );

    // The first element with this text is the div where the name is affected
    expect(screen.getAllByLabelText("Tags")[0]).toHaveAttribute(
      "name",
      "wombatTags"
    );
  });

  it("can populate the list of tags", async () => {
    render(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagIdField tagList={tags} />
      </Formik>
    );
    await userEvent.click(screen.getByRole("textbox", { name: "Tags" }));
    expect(screen.getByRole("option", { name: "tag1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "tag2" })).toBeInTheDocument();
  });
});
