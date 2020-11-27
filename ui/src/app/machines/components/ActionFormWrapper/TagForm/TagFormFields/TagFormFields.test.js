import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import TagForm from "../TagForm";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("TagFormFields", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      machine: machineStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        selected: [],
        statuses: {
          abc123: {},
          def456: {},
        },
      }),
    });
  });

  it("fetches tags on mount", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <TagForm setProcessing={jest.fn()} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some((action) => action.type === "tag/fetch")
    ).toEqual(true);
  });
});
