import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

it("displays a warning when changing the definition", async () => {
  render(
    <Formik
      initialErrors={{
        definition: INVALID_XPATH_ERROR,
      }}
      initialValues={{
        definition: "def1",
      }}
      onSubmit={jest.fn()}
    >
      <DefinitionField />
    </Formik>
  );
  userEvent.type(
    screen.getByRole("textbox", { name: Label.Definition }),
    "def2"
  );
  await waitFor(() => {
    expect(
      screen.getByText(/This tag will be unassigned/i)
    ).toBeInTheDocument();
  });
});
