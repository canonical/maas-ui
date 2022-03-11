import { render, screen } from "@testing-library/react";
import { Formik } from "formik";

import AddTagFormFields, {
  INVALID_XPATH_ERROR,
  Label,
} from "./AddTagFormFields";

it("overrides the xpath errors", async () => {
  render(
    <Formik
      initialErrors={{
        definition: INVALID_XPATH_ERROR,
      }}
      initialValues={{}}
      onSubmit={jest.fn()}
    >
      <AddTagFormFields />
    </Formik>
  );
  expect(
    screen.getByRole("textbox", { name: Label.Definition })
  ).toHaveErrorMessage(
    "The definition is an invalid XPath expression. See our XPath documentation for more examples."
  );
});
