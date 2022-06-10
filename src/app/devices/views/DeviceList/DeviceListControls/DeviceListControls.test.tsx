import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceListControls from "./DeviceListControls";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("DeviceListControls", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  it("changes the search text when the filters change", () => {
    const store = mockStore(initialState);
    const Proxy = ({ filter }: { filter: string }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <DeviceListControls filter={filter} setFilter={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy filter="" />);
    expect(wrapper.find("SearchBox").prop("value")).toBe("");

    wrapper.setProps({ filter: "free-text" });
    wrapper.update();
    expect(wrapper.find("SearchBox").prop("value")).toBe("free-text");
  });
});
