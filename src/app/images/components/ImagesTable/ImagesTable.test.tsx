import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ImagesTable from "./ImagesTable";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  bootResource as resourceFactory,
  bootResourceState as bootResourceStateFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("ImagesTable", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [],
      }),
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
      }),
    });
  });

  it("renders the correct status for a downloaded image that is selected", () => {
    const resource = resourceFactory({
      arch: "amd64",
      complete: true,
      name: "ubuntu/focal",
    });
    state.bootresource.resources = [resource];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ImagesTable
          images={[
            {
              arch: resource.arch,
              os: "ubuntu",
              release: "focal",
              resourceId: resource.id,
              title: "20.04 LTS",
            },
          ]}
          resources={[resource]}
        />
      </Provider>
    );
    expect(
      wrapper.find("[data-testid='resource-status'] Icon").prop("name")
    ).toBe("success");
    expect(wrapper.find("[data-testid='resource-status']").text()).toBe(
      resource.status
    );
  });

  it("renders the correct status for a downloaded image that is not selected", () => {
    const resource = resourceFactory({
      arch: "amd64",
      complete: true,
      name: "ubuntu/focal",
    });
    state.bootresource.resources = [resource];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ImagesTable images={[]} resources={[resource]} />
      </Provider>
    );
    expect(
      wrapper.find("[data-testid='resource-status'] Icon").prop("name")
    ).toBe("error");
    expect(wrapper.find("[data-testid='resource-status']").text()).toBe(
      "Will be deleted"
    );
  });

  it("renders the correct data for a new image", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ImagesTable
          images={[
            {
              arch: "arch",
              os: "os",
              release: "release",
              title: "New release",
            },
          ]}
          resources={[]}
        />
      </Provider>
    );
    expect(wrapper.find("td[data-testid='new-image-title']").text()).toBe(
      "New release"
    );
    expect(
      wrapper.find("[data-testid='new-image-status'] Icon").prop("name")
    ).toBe("pending");
    expect(wrapper.find("[data-testid='new-image-status']").text()).toBe(
      "Selected for download"
    );
  });

  it("can clear an image that has been selected", () => {
    const handleClear = jest.fn();
    const image = {
      arch: "arch",
      os: "os",
      release: "release",
      title: "New release",
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ImagesTable
          handleClear={handleClear}
          images={[image]}
          resources={[]}
        />
      </Provider>
    );
    wrapper.find("button[data-testid='table-actions-clear']").simulate("click");

    expect(handleClear).toHaveBeenCalledWith(image);
  });

  it(`can not clear a selected image if it is the last image that uses the
    default commissioning release`, () => {
    const handleClear = jest.fn();
    const image = {
      arch: "amd64",
      os: "ubuntu",
      release: "focal",
      title: "Ubuntu 20.04 LTS",
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ImagesTable
          handleClear={handleClear}
          images={[image]}
          resources={[]}
        />
      </Provider>
    );
    expect(
      wrapper.find("button[data-testid='table-actions-clear']").prop("disabled")
    ).toBe(true);
  });

  it(`can open the delete image confirmation if the image does not use the
    default commissioning release`, async () => {
    const resources = [
      resourceFactory({ arch: "amd64", name: "ubuntu/bionic" }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
      }),
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ImagesTable
          images={[
            {
              arch: "amd64",
              os: "ubuntu",
              release: "bionic",
              title: "18.04 LTS",
            },
          ]}
          resources={resources}
        />
      </Provider>
    );
    expect(
      wrapper
        .find("button[data-testid='table-actions-delete']")
        .prop("disabled")
    ).toBe(false);

    wrapper
      .find("button[data-testid='table-actions-delete']")
      .simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("DeleteImageConfirm").exists()).toBe(true);
  });

  it(`prevents opening the delete image confirmation if the image uses the
    default commissioning release`, async () => {
    const resources = [
      resourceFactory({ arch: "amd64", name: "ubuntu/focal" }),
    ];
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources,
      }),
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ImagesTable
          images={[
            {
              arch: "amd64",
              os: "ubuntu",
              release: "focal",
              title: "20.04 LTS",
            },
          ]}
          resources={resources}
        />
      </Provider>
    );
    expect(
      wrapper
        .find("button[data-testid='table-actions-delete']")
        .prop("disabled")
    ).toBe(true);
  });
});
