import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import TagForm from "./TagForm";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("TagForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: {
          data: [{ name: "tag", sentence: "tag" }],
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
    });
  });

  it("correctly dispatches actions to tag selected machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123", "def456"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TagForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          tags: [{ name: "tag1" }, { name: "tag2" }],
        })
    );
    expect(
      store.getActions().filter((action) => action.type === "TAG_MACHINE")
    ).toStrictEqual([
      {
        type: "TAG_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "tag",
            extra: {
              tags: ["tag1", "tag2"],
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "TAG_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "tag",
            extra: {
              tags: ["tag1", "tag2"],
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });
});
