import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import UbuntuImages from "./UbuntuImages";

import { actions as bootResourceActions } from "app/store/bootresource";
import { BootResourceSourceType } from "app/store/bootresource/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceUbuntu as bootResourceUbuntuFactory,
  bootResourceUbuntuArch as bootResourceUbuntuArchFactory,
  bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory,
  bootResourceUbuntuSource as sourceFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("UbuntuImages", () => {
  it("correctly sets initial values based on resources", () => {
    const source = sourceFactory();
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
        <UbuntuImages sources={[source]} />
      </Provider>
    );
    expect(wrapper.find("Formik").prop("initialValues")).toStrictEqual({
      images: [
        {
          arch: "amd64",
          os: "ubuntu",
          release: "xenial",
          resourceId: resources[0].id,
          title: "16.04 LTS",
        },
        {
          arch: "i386",
          os: "ubuntu",
          release: "xenial",
          resourceId: resources[1].id,
          title: "16.04 LTS",
        },
        {
          arch: "amd64",
          os: "ubuntu",
          release: "bionic",
          resourceId: resources[3].id,
          title: "18.04 LTS",
        },
      ],
    });
  });

  it("can dispatch an action to save ubuntu images", () => {
    const source = sourceFactory({
      keyring_data: "abcde",
      keyring_filename: "/path/to/file",
      source_type: BootResourceSourceType.MAAS_IO,
      url: "www.url.com",
    });
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: bootResourceUbuntuFactory(),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UbuntuImages sources={[source]} />
      </Provider>
    );
    submitFormikForm(wrapper, {
      images: [
        { arch: "amd64", os: "ubuntu", release: "xenial", title: "16.04 LTS" },
        { arch: "amd64", os: "ubuntu", release: "bionic", title: "18.04 LTS" },
        { arch: "i386", os: "ubuntu", release: "xenial", title: "16.04 LTS" },
      ],
    });

    const expectedAction = bootResourceActions.saveUbuntu({
      keyring_data: "abcde",
      keyring_filename: "/path/to/file",
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
      url: "www.url.com",
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it(`does not show a button to stop importing ubuntu images if none are
    downloading`, () => {
    const source = sourceFactory();
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
        <UbuntuImages sources={[source]} />
      </Provider>
    );

    expect(
      wrapper.find("button[data-testid='secondary-submit']").exists()
    ).toBe(false);
  });

  it(`can dispatch an action to stop importing ubuntu images if at least one is
    downloading`, () => {
    const source = sourceFactory();
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
        <UbuntuImages sources={[source]} />
      </Provider>
    );
    wrapper.find("button[data-testid='secondary-submit']").simulate("click");

    const expectedAction = bootResourceActions.stopImport();
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("disables form with a notification if more than one source detected", () => {
    const sources = [sourceFactory(), sourceFactory()];
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
        <UbuntuImages sources={sources} />
      </Provider>
    );
    expect(wrapper.find("[data-testid='too-many-sources']").exists()).toBe(
      true
    );
    expect(wrapper.find("FormikFormContent").prop("editable")).toBe(false);
  });
});
