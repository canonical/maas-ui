import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ZonesListHeader from "./ZonesListHeader";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ZonesListHeader", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("displays the form when Add AZ is clicked", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ZonesListHeader />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ZonesListForm").exists()).toBe(false);

    wrapper.find("button[data-testid='add-zone']").simulate("click");

    expect(wrapper.find("ZonesListForm").exists()).toBe(true);
  });
});
