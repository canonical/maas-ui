import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerListHeader from "./ControllerListHeader";

import { ControllerHeaderViews } from "app/controllers/constants";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ControllerListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({ system_id: "abc123" }),
          controllerFactory({ system_id: "def456" }),
        ],
      }),
    });
  });

  it("displays a spinner in the header subtitle if controllers have not loaded", () => {
    state.controller.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ControllerListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-testid='section-header-subtitle'] Spinner").exists()
    ).toBe(true);
  });

  it("displays a controllers count if controllers have loaded", () => {
    state.controller.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ControllerListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-subtitle"]').text()).toBe(
      "2 controllers available"
    );
  });

  it("disables the add controller button if any controllers are selected", () => {
    state.controller.selected = ["abc123"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ControllerListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find('button[data-testid="add-controller-button"]')
        .prop("disabled")
    ).toBe(true);
  });

  it("can open the add controller form", () => {
    const setHeaderContent = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ControllerListHeader
            headerContent={null}
            setHeaderContent={setHeaderContent}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("Button[data-testid='add-controller-button']")
      .simulate("click");
    expect(setHeaderContent).toHaveBeenCalledWith({
      view: ControllerHeaderViews.ADD_CONTROLLER,
    });
  });
});
