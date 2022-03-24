import { render, screen } from "@testing-library/react";
import { Formik } from "formik";

import DefinitionField, { INVALID_XPATH_ERROR, Label } from "./DefinitionField";

it("overrides the xpath errors", async () => {
  render(
    <Formik
      initialErrors={{
        definition: INVALID_XPATH_ERROR,
      }}
      initialValues={{}}
      onSubmit={jest.fn()}
    >
      <DefinitionField />
    </Formik>
  );
  expect(
    screen.getByRole("textbox", { name: Label.Definition })
  ).toHaveErrorMessage(
    "The definition is an invalid XPath expression. See our XPath documentation for more examples."
  );
});
