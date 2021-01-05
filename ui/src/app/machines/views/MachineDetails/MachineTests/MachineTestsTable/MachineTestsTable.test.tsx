import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import MachineTestsTable from ".";

import { ResultType, scriptStatus } from "app/base/enum";
import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineTestsTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable
            machineId="abc123"
            scriptResults={[scriptResultFactory(), scriptResultFactory()]}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("dispatches suppress for an unsuppressed script result", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Testing,
        status: scriptStatus.FAILED,
        suppressed: false,
      }),
    ];
    state.scriptresult.items = scriptResults;

    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find('input[data-test="suppress-script-results"]');

    expect(checkbox.props().checked).toEqual(false);

    const event = { target: { value: "checked" } };
    checkbox.simulate("change", event);

    expect(store.getActions()[0].type).toEqual("machine/suppressScriptResults");
  });

  it("dispatches unsuppress for an suppressed script result", () => {
    state.nodescriptresult.items = { abc123: [1] };
    const scriptResults = [
      scriptResultFactory({
        id: 1,
        result_type: ResultType.Testing,
        status: scriptStatus.FAILED,
        suppressed: true,
      }),
    ];
    state.scriptresult.items = scriptResults;

    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineTestsTable machineId="abc123" scriptResults={scriptResults} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = wrapper.find('input[data-test="suppress-script-results"]');

    expect(checkbox.props().checked).toEqual(true);

    const event = { target: { value: "checked" } };
    checkbox.simulate("change", event);

    expect(store.getActions()[0].type).toEqual(
      "machine/unsuppressScriptResults"
    );
  });
});
