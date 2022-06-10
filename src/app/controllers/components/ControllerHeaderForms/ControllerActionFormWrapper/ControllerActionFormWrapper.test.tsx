import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerActionFormWrapper from "./ControllerActionFormWrapper";

import { actions as controllerActions } from "app/store/controller";
import { NodeActions } from "app/store/types/node";
import {
  controller as controllerFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ControllerActionFormWrapper", () => {
  it("can set selected controllers to those that can perform action", () => {
    const state = rootStateFactory();
    const controllers = [
      controllerFactory({ system_id: "abc123", actions: [NodeActions.DELETE] }),
      controllerFactory({ system_id: "def456", actions: [] }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ControllerActionFormWrapper
            action={NodeActions.DELETE}
            clearHeaderContent={jest.fn()}
            controllers={controllers}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('button[data-testid="on-update-selected"]').simulate("click");

    const expectedAction = controllerActions.setSelected(["abc123"]);
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
