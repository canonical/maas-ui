import { Formik } from "formik";

import FormikFormButtons from "./FormikFormButtons";

import { userEvent, render, screen } from "testing/utils";

it("can display a cancel button", () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons onCancel={jest.fn()} submitLabel="Save user" />
    </Formik>
  );
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});

it("can perform a secondary submit action if function and label provided", async () => {
  const secondarySubmit = jest.fn();
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons
        secondarySubmit={secondarySubmit}
        secondarySubmitLabel="Save and add another"
        submitLabel="Save user"
      />
    </Formik>
  );
  expect(screen.getByTestId("secondary-submit")).toHaveTextContent(
    "Save and add another"
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Save and add another" })
  );
  expect(secondarySubmit).toHaveBeenCalled();
});

it("can generate a secondary submit label via a function", async () => {
  const secondarySubmit = jest.fn();
  render(
    <Formik initialValues={{ name: "Koala" }} onSubmit={jest.fn()}>
      <FormikFormButtons
        secondarySubmit={secondarySubmit}
        secondarySubmitLabel={({ name }) => `Kool ${name}`}
        submitLabel="Save user"
      />
    </Formik>
  );
  expect(screen.getByTestId("secondary-submit")).toHaveTextContent(
    "Kool Koala"
  );
  await userEvent.click(screen.getByRole("button", { name: "Kool Koala" }));
  expect(secondarySubmit).toHaveBeenCalled();
});

it("can display a tooltip for the secondary submit action", async () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons
        secondarySubmit={jest.fn()}
        secondarySubmitLabel="Save and add another"
        secondarySubmitTooltip="Will add another"
        submitLabel="Save user"
      />
    </Formik>
  );
  expect(
    screen.getByRole("button", { name: "Save and add another" })
  ).toHaveAccessibleDescription("Will add another");
  expect(
    screen.getByRole("tooltip", { name: "Will add another" })
  ).toBeInTheDocument();
});

it("displays a border if bordered is true", () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons buttonsBordered submitLabel="Save" />
    </Formik>
  );

  expect(screen.getByTestId("buttons-wrapper")).toHaveClass("is-bordered");
});

it("displays inline if inline is true", () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons inline submitLabel="Save" />
    </Formik>
  );
  expect(screen.getByTestId("buttons-wrapper")).toHaveClass("is-inline");
});

it("displays help text if provided", () => {
  const buttonsHelp = <p>Help!</p>;
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons buttonsHelp={buttonsHelp} submitLabel="Save" />
    </Formik>
  );
  expect(screen.getByTestId("buttons-help")).toBeInTheDocument();
  expect(screen.getByTestId("buttons-help")).toHaveTextContent("Help!");
});

it("can fire custom onCancel function", async () => {
  const onCancel = jest.fn();
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons onCancel={onCancel} submitLabel="Save" />
    </Formik>
  );
  await userEvent.click(screen.getByTestId("cancel-action"));
  expect(onCancel).toHaveBeenCalled();
});

it("can display a saving label", () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons saving savingLabel="Be patient!" submitLabel="Save" />
    </Formik>
  );
  expect(screen.getByTestId("saving-label")).toHaveTextContent("Be patient!");
});
