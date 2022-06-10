import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceActionFormWrapper from "./DeviceActionFormWrapper";

import { actions as deviceActions } from "app/store/device";
import { NodeActions } from "app/store/types/node";
import {
  device as deviceFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceActionFormWrapper", () => {
  it("can set selected devices to those that can perform action", () => {
    const state = rootStateFactory();
    const devices = [
      deviceFactory({ system_id: "abc123", actions: [NodeActions.DELETE] }),
      deviceFactory({ system_id: "def456", actions: [] }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/devices", key: "testKey" }]}
        >
          <DeviceActionFormWrapper
            action={NodeActions.DELETE}
            clearHeaderContent={jest.fn()}
            devices={devices}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('button[data-testid="on-update-selected"]').simulate("click");

    const expectedAction = deviceActions.setSelected(["abc123"]);
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
