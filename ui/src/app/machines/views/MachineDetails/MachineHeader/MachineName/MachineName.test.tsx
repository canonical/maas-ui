import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { machine as machineActions } from "app/base/actions";
import MachineName from "./MachineName";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("MachineName", () => {
  let state: RootState;
  const domain = domainFactory({ id: 99 });
  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            domain,
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineName
            editingName={false}
            id="abc123"
            setEditingName={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays just the name when not editable", () => {
    state.machine.items[0].locked = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineName
            editingName={false}
            id="abc123"
            setEditingName={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".machine-name").exists()).toBe(true);
  });

  it("displays name in a button", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineName
            editingName={false}
            id="abc123"
            setEditingName={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Button.machine-name--editable").exists()).toBe(true);
  });

  it("changes the form state when clicking the name", () => {
    const setEditingName = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineName
            editingName={false}
            id="abc123"
            setEditingName={setEditingName}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button.machine-name--editable").simulate("click");
    expect(setEditingName).toHaveBeenCalled();
  });

  it("can display the form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineName
            editingName={true}
            id="abc123"
            setEditingName={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikForm")).toMatchSnapshot();
  });

  it("closes the form when it saves", () => {
    state.machine.saving = true;
    const setEditingName = jest.fn();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineName
            editingName={true}
            id="abc123"
            setEditingName={setEditingName}
          />
        </MemoryRouter>
      </Provider>
    );
    state.machine.saving = false;
    state.machine.saved = true;
    act(() => {
      // Fire something so that the store gets updated.
      store.dispatch(machineActions.update());
    });
    expect(setEditingName).toHaveBeenCalledWith(false);
  });
});
