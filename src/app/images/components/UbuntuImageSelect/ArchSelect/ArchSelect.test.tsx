import { Formik } from "formik";

import ArchSelect, { Labels as ArchSelectLabels } from "./ArchSelect";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithMockStore } from "testing/utils";

describe("ArchSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "bionic",
          }),
        ],
        loaded: true,
        loading: false,
      }),
    });
  });

  it("shows a message if no release is selected", () => {
    renderWithMockStore(
      <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
        <ArchSelect
          arches={[bootResourceUbuntuArchFactory()]}
          release={null}
          resources={[]}
        />
      </Formik>,
      { state }
    );

    expect(
      screen.getByText(ArchSelectLabels.NoReleaseSelected)
    ).toBeInTheDocument();
  });

  it("correctly shows when an arch checkbox is checked", () => {
    const release = bootResourceUbuntuReleaseFactory({ name: "focal" });
    const arches = [
      bootResourceUbuntuArchFactory({ name: "amd64" }),
      bootResourceUbuntuArchFactory({ name: "arm64" }),
    ];
    renderWithMockStore(
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
        <ArchSelect arches={arches} release={release} resources={[]} />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("checkbox", { name: "amd64" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "arm64" })).not.toBeChecked();
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

    renderWithMockStore(
      <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
        <ArchSelect arches={arches} release={release} resources={[]} />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("checkbox", { name: /i386/i })).toBeDisabled();
    expect(
      screen.getByRole("tooltip", {
        name: "i386 is not available on 20.04 LTS.",
      })
    ).toBeInTheDocument();
  });

  it(`disables a checkbox if it's the last checked arch for the default
    commissioning release`, () => {
    state.config.items = [
      configFactory({
        name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
        value: "focal",
      }),
    ];
    const release = bootResourceUbuntuReleaseFactory({
      name: "focal",
      title: "20.04 LTS",
    });
    const arches = [
      bootResourceUbuntuArchFactory({ name: "amd64" }),
      bootResourceUbuntuArchFactory({ name: "arm64" }),
    ];

    renderWithMockStore(
      <Formik
        initialValues={{
          images: [{ arch: "amd64", os: "ubuntu", release: "focal" }],
        }}
        onSubmit={jest.fn()}
      >
        <ArchSelect arches={arches} release={release} resources={[]} />
      </Formik>,
      { state }
    );
    const archCheckbox = screen.getByRole("checkbox", { name: /amd64/i });

    expect(archCheckbox).toBeChecked();
    expect(archCheckbox).toBeDisabled();
    expect(
      screen.getByRole("tooltip", {
        name: ArchSelectLabels.OneArchMustBeSelected,
      })
    ).toBeInTheDocument();
  });
});
