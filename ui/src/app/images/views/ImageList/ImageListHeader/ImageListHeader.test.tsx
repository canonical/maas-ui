import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageListHeader from "./ImageListHeader";

import { actions as configActions } from "app/store/config";
import {
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ImageListHeader", () => {
  it("sets the loading state when polling", () => {
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
    expect(wrapper.find("SectionHeader").prop("loading")).toBe(true);
  });

  it("dispatches an action to update config when changing the auto sync switch", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: "boot_images_auto_import", value: true }),
        ],
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
    wrapper.find("input[data-test='auto-sync-switch']").simulate("change", {
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
});
