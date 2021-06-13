import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageList from "./ImageList";

import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ImageList", () => {
  it("shows a placeholder section while config is loading", () => {
    const state = rootStateFactory({
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
          <ImageList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='placeholder-section']").exists()).toBe(
      true
    );
  });

  it("shows a warning if automatic image sync is disabled", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: "boot_images_auto_import", value: false }),
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
          <ImageList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='disabled-sync-warning']").exists()).toBe(
      true
    );
  });
});
