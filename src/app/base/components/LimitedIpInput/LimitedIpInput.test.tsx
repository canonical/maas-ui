import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import FormikField from "../FormikField";
import FormikForm from "../FormikForm";

import LimitedIpInput from "./LimitedIpInput";

import { renderWithBrowserRouter } from "@/testing/utils";

const { getComputedStyle } = window;

beforeAll(() => {
  // getComputedStyle is not implemeneted in jsdom, so we need to do this.
  window.getComputedStyle = (elt) => getComputedStyle(elt);
});

afterAll(() => {
  // Reset to original implementation
  window.getComputedStyle = getComputedStyle;
});

it("displays the correct range help text for a subnet", () => {
  render(
    <Formik initialValues={{}} onSubmit={vi.fn()}>
      <LimitedIpInput cidr="10.0.0.0/24" name="ip" />
    </Formik>
  );
  expect(screen.getByText("10.0.0.[1-254]")).toBeInTheDocument();
});

it("sets the --immutable css variable to the immutable octets of the subnet", () => {
  render(
    <Formik initialValues={{}} onSubmit={vi.fn()}>
      <LimitedIpInput cidr="10.0.0.0/24" name="ip" />
    </Formik>
  );

  // We have to directly access this node since it's just a wrapper
  expect(
    // eslint-disable-next-line testing-library/no-node-access
    document.querySelector(".limited-ip-input__input-wrapper")
  ).toHaveStyle("--immutable: '10.0.0.'");
});

it("displays the correct placeholder for a subnet", () => {
  render(
    <Formik initialValues={{}} onSubmit={vi.fn()}>
      <LimitedIpInput cidr="10.0.0.0/24" name="ip" />
    </Formik>
  );

  expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "[1-254]");
});

it("trims the immutable octets from a pasted IP address", async () => {
  renderWithBrowserRouter(
    <FormikForm initialValues={{ ip: "" }} onSubmit={vi.fn()}>
      <FormikField cidr="10.0.0.0/24" component={LimitedIpInput} name="ip" />
    </FormikForm>
  );

  await userEvent.click(screen.getByRole("textbox"));
  await userEvent.paste("10.0.0.1");

  expect(screen.getByRole("textbox")).toHaveValue("1");
});
