import { mount } from "enzyme";
import { Formik } from "formik";

import ReleaseFormFields from "./ReleaseFormFields";

import { machine as machineFactory } from "testing/factories";

describe("ReleaseFormFields", () => {
  it("enables checkboxes for quick/secure erase if erasing is enabled", () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          enableErase: true,
          quickErase: false,
          secureErase: false,
        }}
        onSubmit={jest.fn()}
      >
        <ReleaseFormFields machines={[machineFactory()]} />
      </Formik>
    );

    expect(wrapper.find("input[name='quickErase']").prop("disabled")).toBe(
      false
    );
    expect(wrapper.find("input[name='secureErase']").prop("disabled")).toBe(
      false
    );
  });

  it("disables checkboxes for quick/secure erase if erasing is disabled", () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          enableErase: false,
          quickErase: false,
          secureErase: false,
        }}
        onSubmit={jest.fn()}
      >
        <ReleaseFormFields machines={[machineFactory()]} />
      </Formik>
    );

    expect(wrapper.find("input[name='quickErase']").prop("disabled")).toBe(
      true
    );
    expect(wrapper.find("input[name='secureErase']").prop("disabled")).toBe(
      true
    );
  });

  it("shows a warning if the only selected machine has workload annotations", () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          enableErase: false,
          quickErase: false,
          secureErase: false,
        }}
        onSubmit={jest.fn()}
      >
        <ReleaseFormFields
          machines={[
            machineFactory({ workload_annotations: { key1: "value1" } }),
          ]}
        />
      </Formik>
    );

    expect(wrapper.find("[data-test='workloads-warning']").exists()).toBe(true);
    expect(
      wrapper
        .find("[data-test='workloads-warning'] .p-notification__response")
        .text()
    ).toBe(
      "MAAS will remove workload annotations when this machine is released."
    );
  });

  it("shows a warning if some of the selected machines have workload annotations", () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          enableErase: false,
          quickErase: false,
          secureErase: false,
        }}
        onSubmit={jest.fn()}
      >
        <ReleaseFormFields
          machines={[
            machineFactory({ workload_annotations: { key1: "value1" } }),
            machineFactory({ workload_annotations: { key2: "value2" } }),
            machineFactory({ workload_annotations: {} }),
          ]}
        />
      </Formik>
    );

    expect(wrapper.find("[data-test='workloads-warning']").exists()).toBe(true);
    expect(
      wrapper
        .find("[data-test='workloads-warning'] .p-notification__response")
        .text()
    ).toBe(
      "2 of the selected machines have workload annotations. MAAS will remove them when the machines are released."
    );
  });
});
