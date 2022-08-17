import { screen, render } from "@testing-library/react";
import { Formik } from "formik";

import RecordFields from "./RecordFields";

import { RecordType } from "app/store/domain/types";

describe("RecordFields", () => {
  it("disables record type field if in editing state", () => {
    render(
      <Formik initialValues={{ rrtype: RecordType.TXT }} onSubmit={jest.fn()}>
        <RecordFields editing />
      </Formik>
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
