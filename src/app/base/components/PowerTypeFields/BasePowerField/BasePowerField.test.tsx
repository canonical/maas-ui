import { Formik } from "formik";

import BasePowerField from "./BasePowerField";

import { PowerFieldType } from "app/store/general/types";
import { powerField as powerFieldFactory } from "testing/factories";
import { screen, render, userEvent } from "testing/utils";

describe("BasePowerField", () => {
  it("can be given a custom power parameters name", () => {
    const field = powerFieldFactory({ name: "field-name" });
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField
          field={field}
          powerParametersValueName="custom-power-parameters"
        />
      </Formik>
    );
    expect(
      screen.getByRole("textbox", { name: "test-powerfield-label-1" })
    ).toHaveAttribute("name", "custom-power-parameters.field-name");
  });

  it("correctly renders a string field type", () => {
    const field = powerFieldFactory({ field_type: PowerFieldType.STRING });
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).not.toHaveAttribute("type", "password");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("correctly renders a password field type", () => {
    const field = powerFieldFactory({
      field_type: PowerFieldType.PASSWORD,
      label: "Password",
    });
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password"
    );
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("correctly renders a choice field type", () => {
    const field = powerFieldFactory({ field_type: PowerFieldType.CHOICE });
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
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
    render(
      <Formik
        initialValues={{ power_parameters: { field: ["value1"] } }}
        onSubmit={jest.fn()}
      >
        <BasePowerField field={field} />
      </Formik>
    );
    expect(screen.getByTestId("field-label")).toHaveTextContent("label");
    expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
    expect(screen.getAllByRole("checkbox")[1]).not.toBeChecked();

    await userEvent.click(screen.getAllByRole("checkbox")[0]);
    await userEvent.click(screen.getAllByRole("checkbox")[1]);

    expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
    expect(screen.getAllByRole("checkbox")[1]).toBeChecked();
  });
});
