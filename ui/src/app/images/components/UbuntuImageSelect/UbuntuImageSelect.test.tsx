import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import UbuntuImageSelect from "./UbuntuImageSelect";

import type { RootState } from "app/store/root/types";
import {
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("UbuntuImageSelect", () => {
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

  it("does not show a radio button for a release deleted from the source", () => {
    const [available, deleted] = [
      bootResourceUbuntuReleaseFactory({ name: "available", deleted: false }),
      bootResourceUbuntuReleaseFactory({ name: "deleted", deleted: true }),
    ];
    const arches = [bootResourceUbuntuArchFactory()];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <UbuntuImageSelect
            arches={arches}
            releases={[available, deleted]}
            resources={[]}
          />
        </Formik>
      </Provider>
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ images: [] }} onSubmit={jest.fn()}>
          <UbuntuImageSelect
            arches={[available, deleted]}
            releases={releases}
            resources={[]}
          />
        </Formik>
      </Provider>
    );
    const checkboxExists = (id: string) =>
      wrapper
        .findWhere((n) => n.name() === "Input" && n.prop("id") === id)
        .exists();

    expect(checkboxExists("arch-available")).toBe(true);
    expect(checkboxExists("arch-deleted")).toBe(false);
  });
});
