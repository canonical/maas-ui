import { mount } from "enzyme";
import { Formik } from "formik";

import ArchSelect from "./ArchSelect";

import {
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
} from "testing/factories";

describe("ArchSelect", () => {
  it("shows a message if no release is selected", () => {
    const wrapper = mount(
      <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
        <ArchSelect arches={[bootResourceUbuntuArchFactory()]} release={null} />
      </Formik>
    );

    expect(wrapper.find("[data-test='no-release-selected']").text()).toBe(
      "Please select a release to view the available architectures."
    );
  });

  it("correctly shows when an arch checkbox is checked", () => {
    const release = bootResourceUbuntuReleaseFactory({ name: "focal" });
    const arches = [
      bootResourceUbuntuArchFactory({ name: "amd64" }),
      bootResourceUbuntuArchFactory({ name: "arm64" }),
    ];
    const wrapper = mount(
      <Formik
        initialValues={{
          images: [
            {
              arch: "amd64",
              os: "ubuntu",
              release: "focal",
              title: "20.04 LTS",
            },
          ],
        }}
        onSubmit={jest.fn()}
      >
        <ArchSelect arches={arches} release={release} />
      </Formik>
    );
    const radioChecked = (id: string) =>
      wrapper
        .findWhere((n) => n.name() === "Input" && n.prop("id") === id)
        .prop("checked");

    expect(radioChecked("arch-amd64")).toBe(true);
    expect(radioChecked("arch-arm64")).toBe(false);
  });

  it("disables a checkbox with tooltip if release does not support arch", () => {
    const release = bootResourceUbuntuReleaseFactory({
      name: "focal",
      title: "20.04 LTS",
      unsupported_arches: ["i386"],
    });
    const arches = [
      bootResourceUbuntuArchFactory({ name: "amd64" }),
      bootResourceUbuntuArchFactory({ name: "i386" }),
    ];
    const wrapper = mount(
      <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
        <ArchSelect arches={arches} release={release} />
      </Formik>
    );

    expect(
      wrapper
        .findWhere((n) => n.name() === "Input" && n.prop("id") === "arch-i386")
        .prop("disabled")
    ).toBe(true);
    expect(
      wrapper.find("[data-test='disabled-arch-tooltip']").prop("message")
    ).toBe("i386 is not available on 20.04 LTS.");
  });
});
