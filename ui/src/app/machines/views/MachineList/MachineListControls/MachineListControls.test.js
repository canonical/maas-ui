import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import MachineListControls, { DEBOUNCE_INTERVAL } from "./MachineListControls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

jest.useFakeTimers();

describe("MachineListControls", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("changes the filter when the search text changes, after the debounce interval", () => {
    const store = mockStore(initialState);
    const setFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <MachineListControls
            filter=""
            grouping="none"
            setFilter={setFilter}
            setGrouping={jest.fn()}
            setHiddenGroups={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("SearchBox").props().onChange("status:new");
    });
    expect(setFilter).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_INTERVAL);
    });
    expect(setFilter).toHaveBeenCalledWith("status:new");
  });

  it("changes the filter when the filter accordion changes", () => {
    const store = mockStore(initialState);
    const setFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <MachineListControls
            filter=""
            grouping="none"
            setFilter={setFilter}
            setGrouping={jest.fn()}
            setHiddenGroups={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("FilterAccordion").props().setSearchText("status:new");
    });
    expect(setFilter).toHaveBeenCalledWith("status:new");
  });

  it("displays a spinner while debouncing search box input", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListControls
            filter=""
            grouping="none"
            setFilter={jest.fn()}
            setGrouping={jest.fn()}
            setHiddenGroups={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("SearchBox").props().onChange("filtering");
    });
    wrapper.update();
    expect(wrapper.find("i.p-icon--spinner").exists()).toBe(true);
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_INTERVAL);
    });
    wrapper.update();
    expect(wrapper.find("i.p-icon--spinner").exists()).toBe(false);
  });

  it("does not debounce when using filter dropdown", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachineListControls
            filter=""
            grouping="none"
            setFilter={jest.fn()}
            setGrouping={jest.fn()}
            setHiddenGroups={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("FilterAccordion").props().setSearchText("filtering");
    });
    wrapper.update();
    expect(wrapper.find("i.p-icon--spinner").exists()).toBe(false);
  });
});
