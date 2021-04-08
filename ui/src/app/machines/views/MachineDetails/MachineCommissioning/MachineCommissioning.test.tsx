import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Route, MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineCommissioning from ".";

import { HardwareType } from "app/base/enum";
import type { RootState } from "app/store/root/types";
import { ScriptResultType } from "app/store/scriptresult/types";
import { TestStatusStatus } from "app/store/types/node";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
  testStatus as testStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

jest.mock("@canonical/react-components/dist/hooks", () => {
  const hooks = jest.requireActual("@canonical/react-components/dist/hooks");
  return {
    ...hooks,
    usePrevious: jest.fn(),
  };
});

const mockStore = configureStore();

describe("MachineCommissioning", () => {
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

  it("renders the spinner while script results are loading.", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineCommissioning />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toEqual(true);
  });

  it("fetches script results if they haven't been fetched", () => {
    state.nodescriptresult.items = { abc123: [] };
    state.scriptresult.items = [];
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route path="/machine/:id">
            <MachineCommissioning />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store
        .getActions()
        .some((action) => action.type === "scriptresult/getByMachineId")
    ).toBe(true);
  });

  it("does not fetch script results if they have already been loaded", () => {
    state.nodescriptresult.items = { abc123: [] };
    state.scriptresult.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route path="/machine/:id">
            <MachineCommissioning />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "scriptresult/getByMachineId")
        .length
    ).toBe(1);
    wrapper.setProps({});
    expect(
      store
        .getActions()
        .filter((action) => action.type === "scriptresult/getByMachineId")
        .length
    ).toBe(1);
  });

  it("refetchs script results when the machine commissioning status changes", () => {
    // Mock the previous value to something different to the current machine.
    jest
      .spyOn(reactComponentHooks, "usePrevious")
      .mockImplementation(() => TestStatusStatus.PASSED);
    state.machine.items = [
      machineDetailsFactory({
        commissioning_status: testStatusFactory({
          // This value is different to the value stored by usePrevious.
          status: TestStatusStatus.PENDING,
        }),
        locked: false,
        permissions: ["edit"],
        system_id: "abc123",
      }),
    ];
    state.nodescriptresult.items = { abc123: [1] };
    // Add existing script results.
    state.scriptresult.items = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.TESTING,
        hardware_type: HardwareType.CPU,
      }),
    ];
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route path="/machine/:id">
            <MachineCommissioning />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "scriptresult/getByMachineId")
        .length
    ).toBe(1);
  });
});
