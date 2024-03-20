import { Formik } from "formik";

import ArchSelect, { Labels as ArchSelectLabels } from "./ArchSelect";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  renderWithMockStore,
  expectTooltipOnHover,
} from "@/testing/utils";

describe("ArchSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
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
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <ArchSelect
          arches={[factory.bootResourceUbuntuArch()]}
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
    const release = factory.bootResourceUbuntuRelease({ name: "focal" });
    const arches = [
      factory.bootResourceUbuntuArch({ name: "amd64" }),
      factory.bootResourceUbuntuArch({ name: "arm64" }),
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
        onSubmit={vi.fn()}
      >
        <ArchSelect arches={arches} release={release} resources={[]} />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("checkbox", { name: "amd64" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "arm64" })).not.toBeChecked();
  });

  it("disables a checkbox with tooltip if release does not support arch", async () => {
    const release = factory.bootResourceUbuntuRelease({
      name: "focal",
      title: "20.04 LTS",
      unsupported_arches: ["i386"],
    });
    const arches = [
      factory.bootResourceUbuntuArch({ name: "amd64" }),
      factory.bootResourceUbuntuArch({ name: "i386" }),
    ];

    renderWithMockStore(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        <ArchSelect arches={arches} release={release} resources={[]} />
      </Formik>,
      { state }
    );

    const checkbox = screen.getByRole("checkbox", { name: /i386/i });
    expect(checkbox).toBeDisabled();

    await expectTooltipOnHover(
      screen.getByRole("button", { name: "information" }),
      "i386 is not available on 20.04 LTS."
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "i386 is not available on 20.04 LTS."
    );
  });

  it(`disables a checkbox if it's the last checked arch for the default
    commissioning release`, async () => {
    state.config.items = [
      factory.config({
        name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
        value: "focal",
      }),
    ];
    const release = factory.bootResourceUbuntuRelease({
      name: "focal",
      title: "20.04 LTS",
    });
    const arches = [
      factory.bootResourceUbuntuArch({ name: "amd64" }),
      factory.bootResourceUbuntuArch({ name: "arm64" }),
    ];

    renderWithMockStore(
      <Formik
        initialValues={{
          images: [{ arch: "amd64", os: "ubuntu", release: "focal" }],
        }}
        onSubmit={vi.fn()}
      >
        <ArchSelect arches={arches} release={release} resources={[]} />
      </Formik>,
      { state }
    );
    const archCheckbox = screen.getByRole("checkbox", { name: /amd64/i });

    expect(archCheckbox).toBeChecked();
    expect(archCheckbox).toBeDisabled();
    await expectTooltipOnHover(
      screen.getByRole("button", { name: "information" }),
      ArchSelectLabels.OneArchMustBeSelected
    );
  });
});
