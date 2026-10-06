import { Formik } from "formik";

import IPMIPowerFields, {
  CIPHER_SUITE_ID_FIELD_NAME,
  NONE_WORKAROUND_VALUE,
  SECURE_CIPHER_SUITE_ID,
  WORKAROUNDS_FIELD_NAME,
} from "./IPMIPowerFields";

import type { PowerField } from "@/app/store/general/types";
import { PowerFieldType } from "@/app/store/general/types";
import * as factory from "@/testing/factories";
import { render, screen, waitFor } from "@/testing/utils";

let workaroundsField: PowerField;
beforeEach(() => {
  workaroundsField = factory.powerField({
    field_type: PowerFieldType.MULTIPLE_CHOICE,
    label: "Workaround flags",
    name: WORKAROUNDS_FIELD_NAME,
    choices: [
      ["one", "One"],
      [NONE_WORKAROUND_VALUE, "None"],
    ],
  });
});

it("does not render the 'None' choice for the workaround flags field", async () => {
  render(
    <Formik
      initialValues={{
        power_parameters: { [WORKAROUNDS_FIELD_NAME]: [] },
      }}
      onSubmit={vi.fn()}
    >
      <IPMIPowerFields fields={[workaroundsField]} />
    </Formik>
  );

  await waitFor(() => {
    expect(
      screen.queryByRole("checkbox", { name: "None" })
    ).not.toBeInTheDocument();
  });
  expect(screen.getByRole("checkbox", { name: "One" })).toBeInTheDocument();
});

it("forces the cipher suite id field to the secure value and disables other choices when FIPS is active", async () => {
  const cipherSuiteField = factory.powerField({
    choices: [
      ["", "freeipmi-tools default"],
      ["3", "3 - HMAC-SHA1"],
      [SECURE_CIPHER_SUITE_ID, "17 - HMAC-SHA256"],
    ],
    field_type: PowerFieldType.CHOICE,
    label: "Cipher suite id",
    name: CIPHER_SUITE_ID_FIELD_NAME,
  });
  render(
    <Formik
      initialValues={{
        power_parameters: { [CIPHER_SUITE_ID_FIELD_NAME]: "3" },
      }}
      onSubmit={vi.fn()}
    >
      <IPMIPowerFields fields={[cipherSuiteField]} fipsActive />
    </Formik>
  );

  const cipherSuiteSelect = screen.getByRole("combobox", {
    name: "Cipher suite id",
  });
  await waitFor(() => {
    expect(cipherSuiteSelect).toHaveValue(SECURE_CIPHER_SUITE_ID);
  });
  expect(
    screen.getByRole("option", { name: "freeipmi-tools default" })
  ).toBeDisabled();
  expect(screen.getByRole("option", { name: "3 - HMAC-SHA1" })).toBeDisabled();
  expect(
    screen.getByRole("option", { name: "17 - HMAC-SHA256" })
  ).not.toBeDisabled();
});

it("does not force the cipher suite id field when FIPS is not active", async () => {
  const cipherSuiteField = factory.powerField({
    choices: [
      ["", "freeipmi-tools default"],
      ["3", "3 - HMAC-SHA1"],
      [SECURE_CIPHER_SUITE_ID, "17 - HMAC-SHA256"],
    ],
    field_type: PowerFieldType.CHOICE,
    label: "Cipher suite id",
    name: CIPHER_SUITE_ID_FIELD_NAME,
  });
  render(
    <Formik
      initialValues={{
        power_parameters: { [CIPHER_SUITE_ID_FIELD_NAME]: "3" },
      }}
      onSubmit={vi.fn()}
    >
      <IPMIPowerFields fields={[cipherSuiteField]} />
    </Formik>
  );

  const cipherSuiteSelect = screen.getByRole("combobox", {
    name: "Cipher suite id",
  });
  expect(cipherSuiteSelect).toHaveValue("3");
  expect(
    screen.getByRole("option", { name: "3 - HMAC-SHA1" })
  ).not.toBeDisabled();
  expect(
    screen.getByRole("option", { name: "17 - HMAC-SHA256" })
  ).not.toBeDisabled();
});
