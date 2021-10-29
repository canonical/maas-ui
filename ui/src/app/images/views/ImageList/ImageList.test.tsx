import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
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
  it("stops polling when unmounted", () => {
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
    act(() => {
      wrapper.unmount();
    });
    expect(
      store
        .getActions()
        .some((action) => action.type === "bootresource/pollStop")
    ).toBe(true);
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
