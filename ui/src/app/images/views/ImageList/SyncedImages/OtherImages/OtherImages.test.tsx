import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import OtherImages from "./OtherImages";

import { actions as bootResourceActions } from "app/store/bootresource";
import {
  bootResource as bootResourceFactory,
  bootResourceOtherImage as otherImageFactory,
  bootResourceState as bootResourceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("OtherImages", () => {
  it("does not render if there is no other image data", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({ otherImages: [] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OtherImages />
      </Provider>
    );
    expect(wrapper.find("ImagesTable").exists()).toBe(false);
  });

  it("correctly sets initial values based on resources", () => {
    const otherImages = [
      otherImageFactory({
        name: "centos/amd64/generic/centos70",
        title: "CentOS 7",
      }),
    ];
    const resources = [
      bootResourceFactory({
        name: "ubuntu-core/20",
        arch: "amd64",
        title: "Ubuntu Core 20",
      }),
      bootResourceFactory({
        name: "ubuntu/focal",
        arch: "amd64",
        title: "20.04 LTS",
      }),
      bootResourceFactory({
        name: "centos/centos70",
        arch: "amd64",
        title: "CentOS 7",
      }), // only this resource is an "other image"
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages,
        resources,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OtherImages />
      </Provider>
    );
    expect(wrapper.find("Formik").prop("initialValues")).toStrictEqual({
      images: [
        {
          arch: "amd64",
          os: "centos",
          release: "centos70",
          resourceId: resources[2].id,
          subArch: "generic",
          title: "CentOS 7",
        },
      ],
    });
  });

  it("can dispatch an action to save other images", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages: [otherImageFactory()],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OtherImages />
      </Provider>
    );
    submitFormikForm(wrapper, {
      images: [
        {
          arch: "amd64",
          os: "centos",
          release: "centos70",
          subArch: "generic",
        },
      ],
    });

    const expectedAction = bootResourceActions.saveOther({
      images: ["centos/amd64/generic/centos70"],
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it(`does not show a button to stop importing other images if none are
    downloading`, () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages: [otherImageFactory()],
        resources: [
          bootResourceFactory({ downloading: true, name: "ubuntu/focal" }),
          bootResourceFactory({ downloading: false, name: "centos/centos70" }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OtherImages />
      </Provider>
    );

    expect(wrapper.find("button[data-test='secondary-submit']").exists()).toBe(
      false
    );
  });

  it(`can dispatch an action to stop importing other images if at least one is
    downloading`, () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages: [otherImageFactory()],
        resources: [
          bootResourceFactory({ downloading: true, name: "centos/centos70" }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OtherImages />
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
