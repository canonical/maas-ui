import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import FilterAccordion from "./FilterAccordion";

const mockStore = configureStore();

describe("FilterAccordion", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: []
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            link_speeds: [100],
            pool: {
              id: 1,
              name: "pool1"
            },
            zone: {
              id: 1,
              name: "zone1"
            }
          }
        ]
      }
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FilterAccordion setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FilterAccordion")).toMatchSnapshot();
  });

  it("displays a spinner when loading machines", () => {
    state.machine.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FilterAccordion setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("formats link speeds", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FilterAccordion setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(
      wrapper
        .find(".filter-accordion__item")
        .findWhere(button => button.text().includes("100 Mbps"))
        .exists()
    ).toBe(true);
  });

  it("can mark an item as active", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FilterAccordion
            searchText="pool:(=pool1)"
            setSearchText={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find(".filter-accordion__item.is-active").exists()).toBe(
      true
    );
  });

  it("can set a new filter", () => {
    const setSearchText = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FilterAccordion setSearchText={setSearchText} />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper
      .find(".filter-accordion__item")
      .at(0)
      .simulate("click");
    expect(setSearchText).toHaveBeenCalledWith("pool:(=pool1)");
  });

  it("hides filters if there are no values", () => {
    delete state.machine.items[0].link_speeds;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FilterAccordion setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(
      wrapper
        .find(".p-accordion__tab")
        .findWhere(button => button.text() === "Link speed")
        .exists()
    ).toBe(false);
  });

  it("hides filters if the value is an empty array", () => {
    state.machine.items[0].link_speeds = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FilterAccordion setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(
      wrapper
        .find(".p-accordion__tab")
        .findWhere(button => button.text() === "Link speed")
        .exists()
    ).toBe(false);
  });
});
