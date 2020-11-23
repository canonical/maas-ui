import React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ActionFormWrapper from "./ActionFormWrapper";

import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineAction as machineActionFactory,
  machineActionsState as machineActionsStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  scriptsState as scriptsStateFactory,
  scripts as scriptsFactory,
} from "testing/factories";

import { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("ActionFormWrapper", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data: [
            machineActionFactory({
              name: "commission",
            }),
          ],
        }),
      }),
      machine: machineStateFactory({
        errors: {},
        items: [],
        selected: [],
        statuses: { a: machineStatusFactory(), b: machineStatusFactory() },
      }),
      scripts: scriptsStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          scriptsFactory({
            name: "smartctl-validate",
            tags: ["commissioning", "storage"],
            parameters: {
              storage: {
                argument_format: "{path}",
                type: "storage",
              },
            },
            type: 2,
          }),
          scriptsFactory({
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
          }),
        ],
      }),
    });
  });

  it(`displays a warning if not all selected machines can perform selected
  action`, () => {
    const state = { ...initialState };
    state.machine.items = [
      machineFactory({ system_id: "a", actions: ["commission"] }),
      machineFactory({ system_id: "b", actions: [] }),
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
      machineFactory({ system_id: "a", actions: ["commission"] }),
      machineFactory({ system_id: "b", actions: [] }),
    ];
    state.machine.selected = ["a", "b"];
    state.machine.statuses = {
      a: machineStatusFactory({
        commissioning: true,
      }),
      b: machineStatusFactory({
        commissioning: true,
      }),
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
      machineFactory({ system_id: "a", actions: ["commission"] }),
      machineFactory({ system_id: "b", actions: [] }),
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
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({
      type: "machine/setSelected",
      payload: ["a"],
    });
  });
});
