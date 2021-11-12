import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ArchSelect from "./ArchSelect";

import type { RootState } from "app/store/root/types";
import {
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ArchSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: "commissioning_distro_series",
            value: "bionic",
          }),
        ],
        loaded: true,
        loading: false,
      }),
    });
  });

  it("shows a message if no release is selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <ArchSelect
            arches={[bootResourceUbuntuArchFactory()]}
            release={null}
            resources={[]}
          />
        </Formik>
      </Provider>
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
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
        </Formik>
      </Provider>
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <ArchSelect arches={arches} release={release} resources={[]} />
        </Formik>
      </Provider>
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

  it(`disables a checkbox if it's the last checked arch for the default
    commissioning release`, () => {
    state.config.items = [
      configFactory({ name: "commissioning_distro_series", value: "focal" }),
    ];
    const release = bootResourceUbuntuReleaseFactory({
      name: "focal",
      title: "20.04 LTS",
    });
    const arches = [
      bootResourceUbuntuArchFactory({ name: "amd64" }),
      bootResourceUbuntuArchFactory({ name: "arm64" }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            images: [{ arch: "amd64", os: "ubuntu", release: "focal" }],
          }}
          onSubmit={jest.fn()}
        >
          <ArchSelect arches={arches} release={release} resources={[]} />
        </Formik>
      </Provider>
    );
    const archCheckbox = wrapper.findWhere(
      (n) => n.name() === "Input" && n.prop("id") === "arch-amd64"
    );

    expect(archCheckbox.prop("checked")).toBe(true);
    expect(archCheckbox.prop("disabled")).toBe(true);
    expect(
      archCheckbox.find("[data-test='disabled-arch-tooltip']").prop("message")
    ).toBe(
      "At least one architecture must be selected for the default commissioning release."
    );
  });
});
