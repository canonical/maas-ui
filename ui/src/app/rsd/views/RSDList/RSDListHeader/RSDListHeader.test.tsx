import * as React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import RSDListHeader from "./RSDListHeader";

import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RSDListHeader", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loader if pods have not loaded", () => {
    const state = rootStateFactory({ pod: podStateFactory({ loaded: false }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays an rsd count if pods have loaded", () => {
    const pods = [
      podFactory({ type: "rsd" }),
      podFactory({ type: "rsd" }),
      podFactory({ type: "virsh" }),
    ];
    const state = rootStateFactory({
      pod: podStateFactory({ items: pods, loaded: true }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "2 VM hosts available"
    );
  });

  it("disables 'Add RSD' button if at least one RSD is selected", () => {
    const rsds = [podFactory({ type: "rsd" }), podFactory({ type: "rsd" })];
    const state = rootStateFactory({
      pod: podStateFactory({
        items: rsds,
        loaded: true,
        selected: [rsds[0].id],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Button[data-test="add-rsd"]').prop("disabled")).toBe(
      true
    );
  });

  it("clears action form if no RSDs are selected", () => {
    const state = rootStateFactory({
      pod: podStateFactory({ items: [podFactory()], loaded: true }),
    });
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListHeader />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('[data-test="action-menu"] button').prop("disabled")
    ).toBe(true);
  });
});
