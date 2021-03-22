import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DownloadMenu from "./DownloadMenu";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("DownloadMenu", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("renders", () => {
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DownloadMenu />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DownloadMenu").exists()).toBe(true);
  });
});
