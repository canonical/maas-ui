import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ZoneDetailsForm from "./ZoneDetailsForm";

import { ACTION_STATUS } from "app/base/constants";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import {
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("ZoneDetailsForm", () => {
  const testZone = zoneFactory();
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.successful,
        }),
        items: [testZone],
      }),
    });
  });

  it("runs closeForm function when the cancel button is clicked", () => {
    const closeForm = jest.fn();
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ZoneDetailsForm id={testZone.id} closeForm={closeForm} />
      </Provider>
    );

    wrapper.find("button[data-testid='cancel-action']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls actions.update on save click", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ZoneDetailsForm id={testZone.id} closeForm={jest.fn()} />
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        id: testZone.id,
        description: testZone.description,
        name: testZone.name,
      })
    );

    const expectedAction = zoneActions.update({
      id: testZone.id,
      description: testZone.description,
      name: testZone.name,
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
