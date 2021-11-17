import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachinesFilterAccordion from "./MachinesFilterAccordion";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachinesFilterAccordion", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            link_speeds: [100],
            pool: {
              id: 1,
              name: "pool1",
            },
            workload_annotations: {
              type: "production",
            },
            zone: {
              id: 1,
              name: "zone1",
            },
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a spinner when loading machines", () => {
    state.machine.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachinesFilterAccordion searchText="" setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("formats link speeds", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachinesFilterAccordion searchText="" setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(
      wrapper.find("[data-testid='filter-link_speeds']").last().text()
    ).toBe("100 Mbps (1)");
  });

  it("can set a workload filter", () => {
    const setSearchText = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachinesFilterAccordion
            searchText=""
            setSearchText={setSearchText}
          />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper
      .find("[data-testid='filter-workload_annotations']")
      .last()
      .simulate("click");
    expect(setSearchText).toHaveBeenCalledWith("workload-type:()");
  });

  it("can remove a workload filter", () => {
    const setSearchText = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachinesFilterAccordion
            searchText="workload-type:(production)"
            setSearchText={setSearchText}
          />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper
      .find("[data-testid='filter-workload_annotations']")
      .last()
      .simulate("click");
    expect(setSearchText).toHaveBeenCalledWith("");
  });
});
