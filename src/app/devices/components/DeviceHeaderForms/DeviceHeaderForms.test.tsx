import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceHeaderForms from "./DeviceHeaderForms";

import { DeviceHeaderViews } from "app/devices/constants";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("DeviceHeaderForms", () => {
  it("can render the Add Device form", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceHeaderForms
            headerContent={{ view: DeviceHeaderViews.ADD_DEVICE }}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("AddDeviceForm").exists()).toBe(true);
  });
});
