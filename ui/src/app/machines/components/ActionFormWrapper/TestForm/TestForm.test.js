import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import TestForm from "./TestForm";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  scriptsState as scriptsStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("TestForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: {
          data: [{ name: "test", sentence: "test" }],
        },
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: {},
          def456: {},
        },
      }),
      scripts: scriptsStateFactory({
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
      }),
    });
  });

  it("correctly dispatches actions to test selected machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TestForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          enableSSH: true,
          scripts: state.scripts.items,
          scriptInputs: {
            "internet-connectivity": "https://connectivity-check.ubuntu.com",
          },
        })
    );
    expect(
      store.getActions().filter((action) => action.type === "TEST_MACHINE")
    ).toStrictEqual([
      {
        type: "TEST_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "test",
            extra: {
              enable_ssh: true,
              testing_scripts: state.scripts.items.map((script) => script.id),
              script_input: {
                "internet-connectivity":
                  "https://connectivity-check.ubuntu.com",
              },
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "TEST_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "test",
            extra: {
              enable_ssh: true,
              testing_scripts: state.scripts.items.map((script) => script.id),
              script_input: {
                "internet-connectivity":
                  "https://connectivity-check.ubuntu.com",
              },
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("correctly dispatches action to test machine from details view", () => {
    const state = { ...initialState };
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <TestForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          enableSSH: true,
          scripts: state.scripts.items,
          scriptInputs: {
            "internet-connectivity": "https://connectivity-check.ubuntu.com",
          },
        })
    );
    expect(
      store.getActions().filter((action) => action.type === "TEST_MACHINE")
    ).toStrictEqual([
      {
        type: "TEST_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "test",
            extra: {
              enable_ssh: true,
              testing_scripts: state.scripts.items.map((script) => script.id),
              script_input: {
                "internet-connectivity":
                  "https://connectivity-check.ubuntu.com",
              },
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });
});
