import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AddRSDForm from "./AddRSDForm";
import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddRSDForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        items: [zoneFactory()],
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/rsd/add", key: "testKey" }]}
        >
          <AddRSDForm />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["resourcepool/fetch", "FETCH_ZONE"];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = { ...initialState };
    state.resourcepool.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/rsd/add", key: "testKey" }]}
        >
          <AddRSDForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });

  it("can handle saving an RSD pod", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/rsd/add", key: "testKey" }]}
        >
          <AddRSDForm />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        name: "my-favourite-rsd",
        pool: 0,
        power_address: "192.68.1.1",
        power_pass: "password",
        power_user: "admin",
        zone: 0,
      })
    );

    expect(
      store.getActions().find((action) => action.type === "pod/create")
    ).toStrictEqual({
      type: "pod/create",
      meta: {
        method: "create",
        model: "pod",
      },
      payload: {
        params: {
          cpu_over_commit_ratio: 1,
          memory_over_commit_ratio: 1,
          name: "my-favourite-rsd",
          pool: 0,
          power_address: "192.68.1.1",
          power_pass: "password",
          power_user: "admin",
          type: "rsd",
          zone: 0,
        },
      },
    });
  });
});
