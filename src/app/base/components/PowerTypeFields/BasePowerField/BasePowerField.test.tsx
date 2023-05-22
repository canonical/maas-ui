import { waitFor, render } from "@testing-library/react";
import { Formik } from "formik";

import BasePowerField from "./BasePowerField";

import { PowerFieldType } from "app/store/general/types";
import { powerField as powerFieldFactory } from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("BasePowerField", () => {
  it("can be given a custom power parameters name", () => {
    const field = powerFieldFactory({ name: "field-name" });
    const { container } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField
          field={field}
          powerParametersValueName="custom-power-parameters"
        />
      </Formik>
    );
    const input = container.querySelector("input");
    expect(input?.getAttribute("name")).toBe(
      "custom-power-parameters.field-name"
    );
  });

  it("correctly renders a string field type", () => {
    const field = powerFieldFactory({ field_type: PowerFieldType.STRING });
    const { container } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    expect(
      container.querySelector('input[type="password"]')
    ).not.toBeInTheDocument();
    expect(container.querySelector("select")).not.toBeInTheDocument();
  });

  it("correctly renders a password field type", () => {
    const field = powerFieldFactory({ field_type: PowerFieldType.PASSWORD });
    const { container } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(
      container.querySelector('input[type="text"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('input[type="password"]')
    ).toBeInTheDocument();
    expect(container.querySelector("select")).not.toBeInTheDocument();
  });

  it("correctly renders a choice field type", () => {
    const field = powerFieldFactory({ field_type: PowerFieldType.CHOICE });
    const { container } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(
      container.querySelector('input[type="text"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('input[type="password"]')
    ).not.toBeInTheDocument();
    expect(container.querySelector("select")).toBeInTheDocument();
  });

  it("correctly handles a multiple choice field type", async () => {
    const field = powerFieldFactory({
      choices: [
        ["value1", "label1"],
        ["value2", "label2"],
      ],
      field_type: PowerFieldType.MULTIPLE_CHOICE,
      label: "label",
      name: "field",
    });
    renderWithBrowserRouter(
      <Formik
        initialValues={{ power_parameters: { field: ["value1"] } }}
        onSubmit={jest.fn()}
      >
        <BasePowerField field={field} />
      </Formik>,
      { route: "/machines" }
    );
    expect(screen.getByTestId("field-label")).toHaveTextContent("label");
    expect(screen.getByLabelText("label1")).toBeChecked();
    expect(screen.getByLabelText("label2")).not.toBeChecked();

    userEvent.click(screen.getByLabelText("label1"));
    userEvent.click(screen.getByLabelText("label2"));
    await waitFor(() => {
      expect(screen.getByLabelText("label1")).not.toBeChecked();
      expect(screen.getByLabelText("label2")).toBeChecked();
    });
  });
});
