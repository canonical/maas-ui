import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import CoresColumn from "./CoresColumn";

const mockStore = configureStore();

describe("CoresColumn", () => {
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
            system_id: "abc123",
            architecture: "amd64/generic",
            cpu_count: 4
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
          <CoresColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("CoresColumn")).toMatchSnapshot();
  });

  it("displays the number of cores", () => {
    state.machine.items[0].cpu_count = 8;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CoresColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="cores"]').text()).toEqual("8");
  });

  it("truncates architecture", () => {
    state.machine.items[0].architecture = "i386/generic";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CoresColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="arch"]').text()).toEqual("i386");
  });

  it("displays a Tooltip with the full architecture", () => {
    state.machine.items[0].architecture = "amd64/generic";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CoresColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Tooltip").prop("message")).toEqual("amd64/generic");
  });
});
