import { Formik } from "formik";

import IpAssignmentSelect from "./IpAssignmentSelect";

import { DeviceIpAssignment } from "app/store/device/types";
import { getIpAssignmentDisplay } from "app/store/device/utils";
import { screen, render } from "testing/utils";

const staticDisplay = getIpAssignmentDisplay(DeviceIpAssignment.STATIC);

describe("IpAssignmentSelect", () => {
  it("includes static IP assignment as an option by default", () => {
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <IpAssignmentSelect name="ipAssignment" />
      </Formik>
    );

    expect(
      screen.getByRole("option", { name: staticDisplay })
    ).toBeInTheDocument();
  });

  it("can omit static IP assignment as an option", () => {
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <IpAssignmentSelect includeStatic={false} name="ipAssignment" />
      </Formik>
    );

    expect(
      screen.queryByRole("option", { name: staticDisplay })
    ).not.toBeInTheDocument();
  });
});
