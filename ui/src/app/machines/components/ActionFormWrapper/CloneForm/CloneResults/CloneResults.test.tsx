import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import CloneResults, { CloneErrorCodes } from "./CloneResults";

import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineEventError as eventErrorFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CloneResults", () => {
  let state: RootState;
  let machine: MachineDetails;

  beforeEach(() => {
    machine = machineDetailsFactory({ system_id: "abc123" });
    state = rootStateFactory({
      machine: machineStateFactory({ items: [machine], loaded: true }),
    });
  });

  it("correctly formats the results string for a successful result", () => {
    state.machine.eventErrors = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CloneResults
            closeForm={jest.fn()}
            destinations={["def456", "ghi789"]}
            sourceMachine={machine}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='results-string']").text()).toBe(
      `2 of 2 machines cloned successfully from ${machine.hostname}.`
    );
  });

  it("correctly formats the results string for a global error", () => {
    state.machine.eventErrors = [
      eventErrorFactory({
        error: "it didn't work",
        event: NodeActions.CLONE,
        id: machine.system_id,
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CloneResults
            closeForm={jest.fn()}
            destinations={["def456", "ghi789"]}
            sourceMachine={machine}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='results-string']").text()).toBe(
      `0 of 2 machines cloned successfully from ${machine.hostname}.`
    );
  });

  it("groups errors by error code", () => {
    state.machine.eventErrors = [
      eventErrorFactory({
        error: {
          destinations: [
            { code: CloneErrorCodes.STORAGE, message: "Invalid storage" },
            { code: CloneErrorCodes.STORAGE, message: "Invalid storage" },
            { code: CloneErrorCodes.STORAGE, message: "Invalid storage" },
            { code: CloneErrorCodes.NETWORKING, message: "Invalid networking" },
          ],
        },
        event: NodeActions.CLONE,
        id: machine.system_id,
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CloneResults
            closeForm={jest.fn()}
            destinations={["def456", "ghi789"]}
            sourceMachine={machine}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Table[data-test='errors-table']").exists()).toBe(true);
    expect(wrapper.find("TableRow[data-test='error-row']").length).toBe(2);
  });
});
