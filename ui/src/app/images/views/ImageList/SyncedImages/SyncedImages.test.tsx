import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SyncedImages from "./SyncedImages";

import { BootResourceSourceType } from "app/store/bootresource/types";
import {
  bootResourceState as bootResourceStateFactory,
  bootResourceUbuntuSource as sourceFactory,
  bootResourceUbuntu as ubuntuFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SyncedImages", () => {
  it("renders the change source form if no sources are detected", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({ sources: [] }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SyncedImages />
      </Provider>
    );
    expect(wrapper.find("ChangeSource").exists()).toBe(true);
  });

  it("renders the correct text for a single default source", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({
          sources: [
            sourceFactory({ source_type: BootResourceSourceType.MAAS_IO }),
          ],
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SyncedImages />
      </Provider>
    );
    expect(wrapper.find("[data-test='image-sync-text']").text()).toBe(
      "Showing images synced from maas.io"
    );
  });

  it("renders the correct text for a single custom source", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({
          sources: [
            sourceFactory({
              source_type: BootResourceSourceType.CUSTOM,
              url: "www.url.com",
            }),
          ],
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SyncedImages />
      </Provider>
    );
    expect(wrapper.find("[data-test='image-sync-text']").text()).toBe(
      "Showing images synced from www.url.com"
    );
  });

  it("renders the correct text for multiple sources", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({ sources: [sourceFactory(), sourceFactory()] }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SyncedImages />
      </Provider>
    );
    expect(wrapper.find("[data-test='image-sync-text']").text()).toBe(
      "Showing images synced from sources"
    );
  });
});
