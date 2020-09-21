import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import AddRSDForm from "./AddRSDForm";

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
        pool: "pool-1",
        power_address: "192.68.1.1",
        power_pass: "password",
        power_user: "admin",
        zone: "zone-1",
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
          pool: "pool-1",
          power_address: "192.68.1.1",
          power_pass: "password",
          power_user: "admin",
          type: "rsd",
          zone: "zone-1",
        },
      },
    });
  });
});
