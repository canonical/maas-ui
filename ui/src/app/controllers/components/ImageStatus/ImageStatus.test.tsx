import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { ImageStatus } from "./ImageStatus";

import { ImageSyncStatus } from "app/store/controller/types/enum";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerImageSyncStatuses as controllerImageSyncStatusesFactory,
  controllerState as controllerStateFactory,
  controllerStatus as controllerStatusFactory,
  controllerStatuses as controllerStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ImageStatus", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("starts polling the image status", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ImageStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store
        .getActions()
        .some((action) => action.type === "controller/pollCheckImages")
    ).toBe(true);
  });

  it("stops polling when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <ImageStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.unmount();
    });
    expect(
      store
        .getActions()
        .some((action) => action.type === "controller/pollCheckImagesStop")
    ).toBe(true);
  });

  it("shows a spinner when polling", () => {
    state.controller.statuses = controllerStatusesFactory({
      abc123: controllerStatusFactory({ checkingImages: true }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ImageStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("shows the synced state", () => {
    state.controller.imageSyncStatuses = controllerImageSyncStatusesFactory({
      abc123: ImageSyncStatus.Synced,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ImageStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Icon").exists()).toBe(true);
    expect(wrapper.find('[data-testid="status"]').text()).toEqual(
      ImageSyncStatus.Synced
    );
  });

  it("shows a state that is not synced", () => {
    state.controller.imageSyncStatuses = controllerImageSyncStatusesFactory({
      abc123: ImageSyncStatus.Syncing,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ImageStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Icon").exists()).toBe(false);
    expect(wrapper.find('[data-testid="status"]').text()).toEqual(
      ImageSyncStatus.Syncing
    );
  });
});
