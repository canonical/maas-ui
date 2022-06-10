import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import GeneratedImages from "./GeneratedImages";

import { BootResourceType } from "app/store/bootresource/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("GeneratedImages", () => {
  it("does not render if there are no generated resources", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [
          bootResourceFactory({ rtype: BootResourceType.SYNCED }),
          bootResourceFactory({ rtype: BootResourceType.UPLOADED }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <GeneratedImages />
      </Provider>
    );
    expect(wrapper.find("ImagesTable").exists()).toBe(false);
  });

  it("correctly sets images values based on generated resources", () => {
    const resources = [
      bootResourceFactory({
        arch: "amd64",
        name: "esxi/7.0",
        rtype: BootResourceType.UPLOADED,
        title: "VMWare ESXi 7.0",
      }),
      bootResourceFactory({
        arch: "arm64",
        name: "windows/win2012hvr2",
        rtype: BootResourceType.GENERATED,
        title: "Windows 2012",
      }),
      bootResourceFactory({
        arch: "i386",
        name: "centos/centos70",
        rtype: BootResourceType.GENERATED,
        title: "CentOS 7",
      }),
      bootResourceFactory({
        arch: "ppc64el",
        name: "ubuntu/focal",
        rtype: BootResourceType.SYNCED,
        title: "20.04 LTS",
      }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <GeneratedImages />
      </Provider>
    );
    expect(wrapper.find("ImagesTable").prop("images")).toStrictEqual([
      {
        arch: "arm64",
        os: "windows",
        release: "win2012hvr2",
        resourceId: resources[1].id,
        title: "Windows 2012",
      },
      {
        arch: "i386",
        os: "centos",
        release: "centos70",
        resourceId: resources[2].id,
        title: "CentOS 7",
      },
    ]);
  });
});
