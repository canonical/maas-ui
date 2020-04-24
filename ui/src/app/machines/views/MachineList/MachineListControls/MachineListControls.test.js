import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import MachineListControls, { DEBOUNCE_INTERVAL } from "./MachineListControls";

const mockStore = configureStore();

jest.useFakeTimers();

describe("MachineListControls", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      machine: {
        errors: null,
        loading: false,
        loaded: true,
        items: [],
        selected: [],
      },
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("changes the URL when the search text changes, after the debounce interval", () => {
    let location;
    const store = mockStore(initialState);
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
            setFilter={jest.fn()}
            setGrouping={jest.fn()}
            setHiddenGroups={jest.fn()}
          />
          <Route
            path="*"
            render={(props) => {
              location = props.location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("SearchBox").props().onChange("status:new");
    });
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_INTERVAL);
    });
    wrapper.update();
    expect(location.search).toBe("?status=new");
  });

  it("changes the URL when the filter accordion changes", () => {
    let location;
    const store = mockStore(initialState);
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
            setFilter={jest.fn()}
            setGrouping={jest.fn()}
            setHiddenGroups={jest.fn()}
          />
          <Route
            path="*"
            render={(props) => {
              location = props.location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("FilterAccordion").props().setSearchText("status:new");
    });
    wrapper.update();
    expect(location.search).toBe("?status=new");
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
