import { Select } from "@canonical/react-components";
import { mount } from "enzyme";
import { Formik } from "formik";

import IpAssignmentSelect from "./IpAssignmentSelect";

import { DeviceIpAssignment } from "app/store/device/types";

describe("IpAssignmentSelect", () => {
  it("includes static IP assignment as an option by default", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <IpAssignmentSelect name="ipAssignment" />
      </Formik>
    );

    expect(
      wrapper
        .find(Select)
        .prop("options")
        ?.some((option) => option.value === DeviceIpAssignment.STATIC)
    ).toBe(true);
  });

  it("can omit static IP assignment as an option", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <IpAssignmentSelect includeStatic={false} name="ipAssignment" />
      </Formik>
    );

    expect(
      wrapper
        .find(Select)
        .prop("options")
        ?.some((option) => option.value === DeviceIpAssignment.STATIC)
    ).toBe(false);
  });
});
