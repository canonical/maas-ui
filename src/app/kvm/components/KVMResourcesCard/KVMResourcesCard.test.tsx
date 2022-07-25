import reduxToolkit from "@reduxjs/toolkit";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMResourcesCard from "./KVMResourcesCard";

import { actions as machineActions } from "app/store/machine";
import {
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMResourcesCard", () => {
  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches machines on load", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
      }),
    });
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <KVMResourcesCard id={1} />
        </MemoryRouter>
      </Provider>
    );

    const expectedAction = machineActions.fetch("mocked-nanoid");
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("shows a spinner if pods have not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <KVMResourcesCard id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });
});
