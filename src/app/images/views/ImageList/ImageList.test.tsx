import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageList from "./ImageList";

import { ConfigNames } from "app/store/config/types";
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
          configFactory({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: false,
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
          configFactory({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: false,
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
          <ImageList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='disabled-sync-warning']").exists()).toBe(
      true
    );
  });
});
