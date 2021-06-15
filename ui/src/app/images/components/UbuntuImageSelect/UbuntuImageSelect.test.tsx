import { mount } from "enzyme";
import { Formik } from "formik";

import UbuntuImageSelect from "./UbuntuImageSelect";

import {
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
} from "testing/factories";

describe("UbuntuImageSelect", () => {
  it("does not show a radio button for a release deleted from the source", () => {
    const [available, deleted] = [
      bootResourceUbuntuReleaseFactory({ name: "available", deleted: false }),
      bootResourceUbuntuReleaseFactory({ name: "deleted", deleted: true }),
    ];
    const arches = [bootResourceUbuntuArchFactory()];
    const wrapper = mount(
      <Formik initialValues={{ osystems: [] }} onSubmit={jest.fn()}>
        <UbuntuImageSelect arches={arches} releases={[available, deleted]} />
      </Formik>
    );
    const radioExists = (id: string) =>
      wrapper
        .findWhere((n) => n.name() === "Input" && n.prop("id") === id)
        .exists();

    expect(radioExists("release-available")).toBe(true);
    expect(radioExists("release-deleted")).toBe(false);
  });

  it("does not show a checkbox for an architecture delete from the source", () => {
    const releases = [bootResourceUbuntuReleaseFactory({ name: "focal" })];
    const [available, deleted] = [
      bootResourceUbuntuArchFactory({ name: "available", deleted: false }),
      bootResourceUbuntuArchFactory({ name: "delete", deleted: true }),
    ];
    const wrapper = mount(
      <Formik initialValues={{ osystems: [] }} onSubmit={jest.fn()}>
        <UbuntuImageSelect arches={[available, deleted]} releases={releases} />
      </Formik>
    );
    const checkboxExists = (id: string) =>
      wrapper
        .findWhere((n) => n.name() === "Input" && n.prop("id") === id)
        .exists();

    expect(checkboxExists("arch-available")).toBe(true);
    expect(checkboxExists("arch-deleted")).toBe(false);
  });
});
