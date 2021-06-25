import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DashboardHeader from "./DashboardHeader";

import dashboardURLs from "app/dashboard/urls";
import type { RootState } from "app/store/root/types";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DashboardHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays the discovery count in the header", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DashboardHeader />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(`[to='${dashboardURLs.index}']`).text()).toBe(
      "2 discoveries"
    );
  });

  it("has a button to clear discoveries", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DashboardHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='clear-all']").exists()).toBe(true);
  });

  it("hides the clear-all button when the form is visible", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DashboardHeader />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("[data-test='clear-all']").last().simulate("click");
    expect(wrapper.find("[data-test='clear-all']").exists()).toBe(false);
  });
});
