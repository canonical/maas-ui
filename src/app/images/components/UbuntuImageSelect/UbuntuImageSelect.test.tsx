import { screen } from "@testing-library/react";
import { Formik } from "formik";

import UbuntuImageSelect from "./UbuntuImageSelect";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("UbuntuImageSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
        loaded: true,
        loading: false,
      }),
    });
  });

  it("does not show a radio button for a release deleted from the source", () => {
    const [available, deleted] = [
      bootResourceUbuntuReleaseFactory({
        name: "available",
        deleted: false,
        title: "20.04 LTS",
      }),
      bootResourceUbuntuReleaseFactory({
        name: "deleted",
        deleted: true,
        title: "20.10",
      }),
    ];
    const arches = [bootResourceUbuntuArchFactory()];
    renderWithMockStore(
      <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
        <UbuntuImageSelect
          arches={arches}
          releases={[available, deleted]}
          resources={[]}
        />
      </Formik>,
      { state }
    );

    expect(
      screen.queryByRole("radio", { name: "20.10" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "20.04 LTS" })
    ).toBeInTheDocument();
  });

  it("does not show a checkbox for an architecture delete from the source", () => {
    const releases = [bootResourceUbuntuReleaseFactory({ name: "focal" })];
    const [available, deleted] = [
      bootResourceUbuntuArchFactory({
        name: "available",
        deleted: false,
      }),
      bootResourceUbuntuArchFactory({
        name: "delete",
        deleted: true,
      }),
    ];

    renderWithMockStore(
      <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
        <UbuntuImageSelect
          arches={[available, deleted]}
          releases={releases}
          resources={[]}
        />
      </Formik>,
      { state }
    );

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(1);
    expect(checkboxes[0]).toHaveProperty("id", "arch-available");
  });
});
