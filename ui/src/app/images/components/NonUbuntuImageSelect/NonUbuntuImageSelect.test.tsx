import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NonUbuntuImageSelect from "./NonUbuntuImageSelect";

import type { RootState } from "app/store/root/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceOtherImage as otherImageFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NonUbuntuImageSelect", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        otherImages: [],
        resources: [],
      }),
      config: configStateFactory({
        items: [
          configFactory({
            name: "commissioning_distro_series",
            value: "focal",
          }),
        ],
      }),
    });
  });

  it("correctly shows when an image checkbox is checked", () => {
    const otherImages = [
      otherImageFactory({
        name: "centos/amd64/generic/centos7",
        title: "CentOS 7",
      }),
      otherImageFactory({ name: "centos/amd64/generic/8", title: "CentOS 8" }),
    ];
    const resources = [bootResourceFactory()];
    state.bootresource.otherImages = otherImages;
    state.bootresource.resources = resources;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            images: [
              {
                arch: "amd64",
                os: "centos",
                release: "centos7",
                subArch: "generic",
                title: "CentOS 7",
              },
            ],
          }}
          onSubmit={jest.fn()}
        >
          <NonUbuntuImageSelect images={otherImages} resources={resources} />
        </Formik>
      </Provider>
    );
    const imageChecked = (id: string) =>
      wrapper
        .findWhere((n) => n.name() === "Input" && n.prop("id") === id)
        .prop("checked");

    expect(imageChecked("image-centos/amd64/generic/centos7")).toBe(true);
    expect(imageChecked("image-centos/amd64/generic/8")).toBe(false);
  });
});
