/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import FormikField from "../FormikField";
import FormikForm from "../FormikForm";

import PrefixedIpInput from "./PrefixedIpInput";

import { renderWithBrowserRouter } from "@/testing/utils";

it("displays the correct range help text for a subnet", () => {
  render(
    <Formik initialValues={{}} onSubmit={vi.fn()}>
      <PrefixedIpInput cidr="10.0.0.0/24" name="ip" />
    </Formik>
  );
  expect(screen.getByText("10.0.0.[1-254]")).toBeInTheDocument();
});

it("displays the correct placeholder for a subnet", () => {
  render(
    <Formik initialValues={{}} onSubmit={vi.fn()}>
      <PrefixedIpInput cidr="10.0.0.0/24" name="ip" />
    </Formik>
  );

  expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "[1-254]");
});

it("trims the immutable octets from a pasted IP address", async () => {
  renderWithBrowserRouter(
    <FormikForm initialValues={{ ip: "" }} onSubmit={vi.fn()}>
      <FormikField cidr="10.0.0.0/24" component={PrefixedIpInput} name="ip" />
    </FormikForm>
  );

  await userEvent.click(screen.getByRole("textbox"));
  await userEvent.paste("10.0.0.1");

  expect(screen.getByRole("textbox")).toHaveValue("1");
});
