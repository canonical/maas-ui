import { Formik } from "formik";

import TagNameField from "./TagNameField";

import { render, screen, userEvent } from "testing/utils";

describe("FormikField", () => {
  it("maps the initial value to the tag format", () => {
    render(
      <Formik
        initialValues={{ tags: ["koala", "wallaby"] }}
        onSubmit={jest.fn()}
      >
        <TagNameField />
      </Formik>
    );
    expect(screen.getByRole("button", { name: "koala" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "wallaby" })).toBeInTheDocument();
  });

  it("can override the field name", () => {
    render(
      <Formik initialValues={{ tags: null }} onSubmit={jest.fn()}>
        <TagNameField name="wombatTags" />
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
        <TagNameField tagList={["koala", "wallaby"]} />
      </Formik>
    );
    await userEvent.click(screen.getByRole("textbox", { name: "Tags" }));
    expect(screen.getByRole("option", { name: "koala" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "wallaby" })).toBeInTheDocument();
  });
});
