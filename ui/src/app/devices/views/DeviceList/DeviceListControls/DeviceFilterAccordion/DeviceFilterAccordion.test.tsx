import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceFilterAccordion from "./DeviceFilterAccordion";

import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceFilterAccordion", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceFactory()],
        loaded: true,
      }),
    });
  });

  it("is disabled if devices haven't loaded yet", () => {
    state.device.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/devices", key: "testKey" }]}
        >
          <DeviceFilterAccordion searchText="" setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FilterAccordion").prop("disabled")).toBe(true);
  });
});
