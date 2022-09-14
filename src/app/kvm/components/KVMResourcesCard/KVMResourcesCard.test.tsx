import reduxToolkit from "@reduxjs/toolkit";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMResourcesCard from "./KVMResourcesCard";

import { actions as machineActions } from "app/store/machine";
import { PodType } from "app/store/pod/constants";
import {
  podState as podStateFactory,
  rootState as rootStateFactory,
  pod as podFactory,
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
        items: [podFactory({ id: 1, type: PodType.LXD })],
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
      store.getActions().some((action) => action.type === expectedAction.type)
    ).toBe(true);
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
