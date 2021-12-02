import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagForm from "./TagForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("TagForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      tag: tagStateFactory({
        loaded: true,
      }),
    });
  });

  it("dispatches action to fetch tags on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TagForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "tag/fetch")
    ).toBe(true);
  });

  it("correctly dispatches actions to tag machines", () => {
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TagForm
            clearHeaderContent={jest.fn()}
            machines={machines}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        tags: ["tag1", "tag2"],
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "machine/tag")
    ).toStrictEqual([
      {
        type: "machine/tag",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.TAG,
            extra: {
              tags: ["tag1", "tag2"],
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/tag",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.TAG,
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
