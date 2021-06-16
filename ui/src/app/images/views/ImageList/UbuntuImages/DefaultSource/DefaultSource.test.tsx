import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DefaultSource from "./DefaultSource";

import { actions as bootResourceActions } from "app/store/bootresource";
import { BootResourceSourceType } from "app/store/bootresource/types";
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
      bootResourceFactory({
        name: "ubuntu/xenial",
        arch: "amd64",
        title: "16.04 LTS",
      }),
      bootResourceFactory({
        name: "ubuntu/xenial",
        arch: "i386",
        title: "16.04 LTS",
      }),
      bootResourceFactory({
        name: "ubuntu/xenial",
        arch: "s390x",
        title: "16.04 LTS",
      }), // source does not know this arch
      bootResourceFactory({
        name: "ubuntu/bionic",
        arch: "amd64",
        title: "18.04 LTS",
      }),
      bootResourceFactory({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }), // source does not know this release
      bootResourceFactory({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }), // only Ubuntu resources are relevant
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
        { arch: "amd64", os: "ubuntu", release: "xenial", title: "16.04 LTS" },
        { arch: "i386", os: "ubuntu", release: "xenial", title: "16.04 LTS" },
        { arch: "amd64", os: "ubuntu", release: "bionic", title: "18.04 LTS" },
      ],
    });
  });

  it("can dispatch an action to save ubuntu images", () => {
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
    wrapper.find("Formik").invoke("onSubmit")({
      images: [
        { arch: "amd64", os: "ubuntu", release: "xenial", title: "16.04 LTS" },
        { arch: "amd64", os: "ubuntu", release: "bionic", title: "18.04 LTS" },
        { arch: "i386", os: "ubuntu", release: "xenial", title: "16.04 LTS" },
      ],
    });

    const expectedAction = bootResourceActions.saveUbuntu({
      osystems: [
        {
          arches: ["amd64", "i386"],
          osystem: "ubuntu",
          release: "xenial",
        },
        {
          arches: ["amd64"],
          osystem: "ubuntu",
          release: "bionic",
        },
      ],
      source_type: BootResourceSourceType.MAAS_IO,
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it(`does not show a button to stop importing ubuntu images if none are
    downloading`, () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [
          bootResourceFactory({ downloading: false, name: "ubuntu/focal" }),
          bootResourceFactory({ downloading: true, name: "centos/centos70" }),
        ],
        ubuntu: bootResourceUbuntuFactory(),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DefaultSource />
      </Provider>
    );

    expect(wrapper.find("button[data-test='secondary-submit']").exists()).toBe(
      false
    );
  });

  it(`can dispatch an action to stop importing ubuntu images if at least one is
    downloading`, () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [
          bootResourceFactory({ downloading: true, name: "ubuntu/focal" }),
        ],
        ubuntu: bootResourceUbuntuFactory(),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DefaultSource />
      </Provider>
    );
    wrapper.find("button[data-test='secondary-submit']").simulate("click");

    const expectedAction = bootResourceActions.stopImport();
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
