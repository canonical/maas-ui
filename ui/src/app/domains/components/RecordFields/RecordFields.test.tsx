import { mount } from "enzyme";
import { Formik } from "formik";

import RecordFields from "./RecordFields";

import { RecordType } from "app/store/domain/types";

describe("RecordFields", () => {
  it("disables record type field if in editing state", () => {
    const wrapper = mount(
      <Formik initialValues={{ rrtype: RecordType.TXT }} onSubmit={jest.fn()}>
        <RecordFields editing />
      </Formik>
    );
    expect(wrapper.find("FormikField[name='rrtype']").prop("disabled")).toBe(
      true
    );
  });
});
