import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import UbuntuCoreImages from "./UbuntuCoreImages";

import { actions as bootResourceActions } from "app/store/bootresource";
import {
  bootResource as bootResourceFactory,
  bootResourceUbuntuCoreImage as ubuntuCoreImageFactory,
  bootResourceState as bootResourceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("UbuntuCoreImages", () => {
  it("does not render if there is no Ubuntu core image data", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({ ubuntuCoreImages: [] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UbuntuCoreImages />
      </Provider>
    );
    expect(wrapper.find("ImagesTable").exists()).toBe(false);
  });

  it("correctly sets initial values based on resources", () => {
    const ubuntuCoreImages = [
      ubuntuCoreImageFactory({
        name: "ubuntu-core/amd64/generic/20",
        title: "Ubuntu Core 20",
      }),
    ];
    const resources = [
      bootResourceFactory({
        name: "ubuntu-core/20",
        arch: "amd64",
        title: "Ubuntu Core 20",
      }), // only this resource is an "Ubuntu core image"
      bootResourceFactory({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }),
      bootResourceFactory({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
        ubuntuCoreImages,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UbuntuCoreImages />
      </Provider>
    );
    expect(wrapper.find("Formik").prop("initialValues")).toStrictEqual({
      images: [
        {
          arch: "amd64",
          os: "ubuntu-core",
          release: "20",
          resourceId: resources[0].id,
          subArch: "generic",
          title: "Ubuntu Core 20",
        },
      ],
    });
  });

  it("can dispatch an action to save Ubuntu core images", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntuCoreImages: [ubuntuCoreImageFactory()],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UbuntuCoreImages />
      </Provider>
    );
    submitFormikForm(wrapper, {
      images: [
        {
          arch: "amd64",
          os: "ubuntu-core",
          release: "20",
          subArch: "generic",
          title: "Ubuntu Core 20",
        },
      ],
    });

    const expectedAction = bootResourceActions.saveUbuntuCore({
      images: ["ubuntu-core/amd64/generic/20"],
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it(`does not show a button to stop importing Ubuntu core images if none are
    downloading`, () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [
          bootResourceFactory({ downloading: true, name: "ubuntu/focal" }),
          bootResourceFactory({ downloading: false, name: "ubuntu-core/20" }),
        ],
        ubuntuCoreImages: [ubuntuCoreImageFactory()],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UbuntuCoreImages />
      </Provider>
    );

    expect(wrapper.find("button[data-test='secondary-submit']").exists()).toBe(
      false
    );
  });

  it(`can dispatch an action to stop importing Ubuntu core images if at least
    one is downloading`, () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [
          bootResourceFactory({ downloading: true, name: "ubuntu-core/20" }),
        ],
        ubuntuCoreImages: [ubuntuCoreImageFactory()],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <UbuntuCoreImages />
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
