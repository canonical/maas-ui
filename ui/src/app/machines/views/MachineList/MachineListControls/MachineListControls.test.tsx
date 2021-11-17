import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineListControls, { DEBOUNCE_INTERVAL } from "./MachineListControls";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

jest.useFakeTimers("modern");

describe("MachineListControls", () => {
  let initialState: RootState;

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
      wrapper.find("SearchBox input[name='search']").simulate("change", {
        target: { name: "search", value: "status:new" },
      });
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
      wrapper.find(MachinesFilterAccordion).props().setSearchText("status:new");
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
      wrapper.find("SearchBox input[name='search']").simulate("change", {
        target: { name: "search", value: "filtering" },
      });
    });
    wrapper.update();
    expect(wrapper.find("[data-testid='search-spinner']").exists()).toBe(true);
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_INTERVAL);
    });
    wrapper.update();
    expect(wrapper.find("[data-testid='search-spinner']").exists()).toBe(false);
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
      wrapper.find(MachinesFilterAccordion).props().setSearchText("filtering");
    });
    wrapper.update();
    expect(wrapper.find("[data-testid='search-spinner']").exists()).toBe(false);
  });
});
