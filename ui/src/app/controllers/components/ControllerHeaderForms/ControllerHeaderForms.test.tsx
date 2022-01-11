import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerHeaderForms from "./ControllerHeaderForms";

import { ControllerHeaderViews } from "app/controllers/constants";
import {
  controller as controllerFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ControllerHeaderForms", () => {
  it("can render the action form wrapper", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ControllerHeaderForms
            controllers={[controllerFactory()]}
            headerContent={{ view: ControllerHeaderViews.SET_ZONE_CONTROLLER }}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ControllerActionFormWrapper").exists()).toBe(true);
  });
});
