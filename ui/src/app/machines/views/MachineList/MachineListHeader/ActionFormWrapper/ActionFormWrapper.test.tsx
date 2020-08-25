import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import ActionFormWrapper from "./ActionFormWrapper";

const mockStore = configureStore();

describe("ActionFormWrapper", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      general: {
        machineActions: {
          data: [{ name: "commission", sentence: "commission" }],
        },
      },
      machine: {
        errors: {},
        items: [],
        selected: [],
        statuses: { a: {}, b: {} },
      },
      scripts: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            name: "smartctl-validate",
            tags: ["commissioning", "storage"],
            parameters: {
              storage: {
                argument_format: "{path}",
                type: "storage",
              },
            },
            type: 2,
          },
          {
            name: "internet-connectivity",
            tags: ["internet", "network-validation", "network"],
            parameters: {
              url: {
                default: "https://connectivity-check.ubuntu.com",
                description:
                  "A comma seperated list of URLs, IPs, or domains to test if the specified interface has access to. Any protocol supported by curl is support. If no protocol or icmp is given the URL will be pinged.",
                required: true,
              },
            },
            type: 2,
          },
        ],
      },
    };
  });

  it(`displays a warning if not all selected machines can perform selected
  action`, () => {
    const state = { ...initialState };
    state.machine.items = [
      { system_id: "a", actions: ["commission"] },
      { system_id: "b", actions: [] },
    ];
    state.machine.selected = ["a", "b"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionFormWrapper
            selectedAction={{
              name: "commission",
              sentence: "commissioned",
              title: "Commission...",
              type: "lifecycle",
            }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='machine-action-warning']").exists()).toBe(
      true
    );
  });

  it(`does not display a warning when processing and not all selected machines
    can perform selected action`, async () => {
    const state = { ...initialState };
    state.machine.items = [
      { system_id: "a", actions: ["commission"] },
      { system_id: "b", actions: [] },
    ];
    state.machine.selected = ["a", "b"];
    state.machine.statuses = {
      a: {
        commissioning: true,
      },
      b: {
        commissioning: true,
      },
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionFormWrapper
            selectedAction={{
              name: "commission",
              sentence: "commissioned",
              title: "Commission...",
              type: "lifecycle",
            }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
      { context: store }
    );

    await act(async () => {
      expect(
        wrapper.find("[data-test='machine-action-warning']").exists()
      ).toBe(false);
    });
  });

  it("can set selected machines to those that can perform action", () => {
    const state = { ...initialState };
    state.machine.items = [
      { system_id: "a", actions: ["commission"] },
      { system_id: "b", actions: [] },
    ];
    state.machine.selected = ["a", "b"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionFormWrapper
            selectedAction={{
              name: "commission",
              sentence: "commissioned",
              title: "Commission...",
              type: "lifecycle",
            }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find('[data-test="select-actionable-machines"] button')
      .simulate("click");

    expect(
      store
        .getActions()
        .find((action) => action.type === "SET_SELECTED_MACHINES")
    ).toStrictEqual({
      type: "SET_SELECTED_MACHINES",
      payload: ["a"],
    });
  });
});
