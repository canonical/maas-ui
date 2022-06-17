import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageListHeader from "./ImageListHeader";

import { actions as configActions } from "app/store/config";
import { ConfigNames } from "app/store/config/types";
import {
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ImageListHeader", () => {
  it("sets the subtitle loading state when polling", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: true,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SectionHeader").prop("subtitleLoading")).toBe(true);
  });

  it("does not show sync toggle if config has not loaded yet", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: true,
        }),
      }),
      config: configStateFactory({
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='auto-sync-switch']").exists()).toBe(
      false
    );
  });

  it("dispatches an action to update config when changing the auto sync switch", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: true,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageListHeader />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("input[data-testid='auto-sync-switch']").simulate("change", {
      target: { checked: false, id: "auto-sync-switch" },
    });
    const actualActions = store.getActions();
    const expectedAction = configActions.update({
      boot_images_auto_import: false,
    });
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });

  it("can show the rack import status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        rackImportRunning: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='rack-importing']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='region-importing']").exists()).toBe(
      false
    );
  });

  it("can show the region import status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        regionImportRunning: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='region-importing']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-testid='rack-importing']").exists()).toBe(false);
  });
});
