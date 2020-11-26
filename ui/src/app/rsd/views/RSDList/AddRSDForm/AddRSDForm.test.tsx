import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddRSDForm from "./AddRSDForm";

import {
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddRSDForm", () => {
  it("fetches the necessary data on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/rsd/add", key: "testKey" }]}
        >
          <AddRSDForm />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["resourcepool/fetch", "zone/fetch"];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({ loaded: false }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/rsd/add", key: "testKey" }]}
        >
          <AddRSDForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });

  it("can handle saving an RSD", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({ loaded: true }),
      zone: zoneStateFactory({ loaded: true }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/rsd/add", key: "testKey" }]}
        >
          <AddRSDForm />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").invoke("onSubmit")({
        name: "my-favourite-rsd",
        pool: 0,
        power_address: "192.68.1.1",
        power_pass: "password",
        power_user: "admin",
        zone: 1,
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
          name: "my-favourite-rsd",
          pool: 0,
          power_address: "192.68.1.1",
          power_pass: "password",
          power_user: "admin",
          type: "rsd",
          zone: 1,
        },
      },
    });
  });
});
