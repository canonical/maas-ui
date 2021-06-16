import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DefaultSource from "./DefaultSource";

import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceUbuntu as bootResourceUbuntuFactory,
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DefaultSource", () => {
  it("shows a spinner if ubuntu image metadata has not been loaded yet", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({ ubuntu: null }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DefaultSource />
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
    expect(wrapper.find("UbuntuImageSelect").exists()).toBe(false);
  });

  it("shows the ubuntu image selection form if metadata has loaded", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: bootResourceUbuntuFactory(),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DefaultSource />
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(false);
    expect(wrapper.find("UbuntuImageSelect").exists()).toBe(true);
  });

  it("correctly sets initial values based on resources", () => {
    const ubuntu = bootResourceUbuntuFactory({
      arches: [
        bootResourceUbuntuArchFactory({ name: "amd64" }),
        bootResourceUbuntuArchFactory({ name: "i386" }),
      ],
      releases: [
        bootResourceUbuntuReleaseFactory({ name: "xenial" }),
        bootResourceUbuntuReleaseFactory({ name: "bionic" }),
      ],
    });
    const resources = [
      bootResourceFactory({ name: "ubuntu/xenial", arch: "amd64" }),
      bootResourceFactory({ name: "ubuntu/xenial", arch: "i386" }),
      bootResourceFactory({ name: "ubuntu/xenial", arch: "s390x" }), // source does not know this arch
      bootResourceFactory({ name: "ubuntu/bionic", arch: "amd64" }),
      bootResourceFactory({ name: "ubuntu/focal", arch: "amd64" }), // source does not know this release
      bootResourceFactory({ name: "centos/centos70", arch: "amd64" }), // only Ubuntu resources are relevant
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
        ubuntu,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DefaultSource />
      </Provider>
    );
    expect(wrapper.find("Formik").prop("initialValues")).toStrictEqual({
      images: [
        { arch: "amd64", os: "ubuntu", release: "xenial" },
        { arch: "i386", os: "ubuntu", release: "xenial" },
        { arch: "amd64", os: "ubuntu", release: "bionic" },
      ],
    });
  });
});
