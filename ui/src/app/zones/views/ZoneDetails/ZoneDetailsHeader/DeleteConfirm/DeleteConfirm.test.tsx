import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeleteConfirm from "./DeleteConfirm";

import { ACTION_STATUS } from "app/base/constants";
import type { RootState } from "app/store/root/types";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import {
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeleteConfirm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
        }),
        items: [
          zoneFactory({
            id: 1,
            name: "zone-name",
          }),
        ],
      }),
    });
  });

  it("runs onConfirm function when Delete AZ is clicked", () => {
    const closeExpanded = jest.fn();
    const onConfirm = jest.fn();
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteConfirm
          confirmLabel="Delete AZ"
          closeExpanded={closeExpanded}
          onConfirm={onConfirm}
        />
      </Provider>
    );

    wrapper.find("button[data-testid='delete-az']").simulate("click");
    expect(onConfirm).toHaveBeenCalled();
  });

  it("runs closeExpanded function when cancel is clicked", () => {
    const closeExpanded = jest.fn();
    const onConfirm = jest.fn();
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteConfirm
          confirmLabel="Delete AZ"
          closeExpanded={closeExpanded}
          onConfirm={onConfirm}
        />
      </Provider>
    );

    wrapper
      .find("button[data-testid='close-confirm-delete']")
      .simulate("click");
    expect(closeExpanded).toHaveBeenCalled();
  });
});
