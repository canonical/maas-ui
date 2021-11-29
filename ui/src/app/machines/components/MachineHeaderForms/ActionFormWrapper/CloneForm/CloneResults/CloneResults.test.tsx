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

  it("handles a successful clone result", () => {
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
    expect(wrapper.find("[data-testid='results-string']").text()).toBe(
      `2 of 2 machines cloned successfully from ${machine.hostname}.`
    );
    expect(wrapper.find("Link[data-testid='error-filter-link']").exists()).toBe(
      false
    );
  });

  it("handles global clone errors", () => {
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
    expect(wrapper.find("[data-testid='results-string']").text()).toBe(
      `0 of 2 machines cloned successfully from ${machine.hostname}.`
    );
    expect(wrapper.find("[data-testid='error-description']").text()).toBe(
      "Cloning was unsuccessful: it didn't work"
    );
    expect(
      wrapper.find("Link[data-testid='error-filter-link']").prop("to")
    ).toBe("/machines?system_id=def456%2Cghi789");
  });

  it("handles non-invalid item destination errors", () => {
    state.machine.eventErrors = [
      eventErrorFactory({
        error: {
          destinations: [
            {
              code: CloneErrorCodes.STORAGE,
              message: "Invalid storage",
              system_id: "def456",
            },
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
    expect(wrapper.find("[data-testid='results-string']").text()).toBe(
      `1 of 2 machines cloned successfully from ${machine.hostname}.`
    );
    expect(
      wrapper.find("Link[data-testid='error-filter-link']").prop("to")
    ).toBe("/machines?system_id=def456");
  });

  it("handles invalid item destination errors", () => {
    state.machine.eventErrors = [
      eventErrorFactory({
        error: {
          destinations: [
            {
              code: CloneErrorCodes.ITEM_INVALID,
              message: "Invalid item",
              system_id: "def456",
            },
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
    // Both machines failed to clone.
    expect(wrapper.find("[data-testid='results-string']").text()).toBe(
      `0 of 2 machines cloned successfully from ${machine.hostname}.`
    );
    // But only one machine should have caused an error.
    expect(
      wrapper.find("Link[data-testid='error-filter-link']").prop("to")
    ).toBe("/machines?system_id=def456");
  });

  it("groups errors by error code", () => {
    state.machine.eventErrors = [
      eventErrorFactory({
        error: {
          destinations: [
            {
              code: CloneErrorCodes.STORAGE,
              message: "Invalid storage",
              system_id: "def456",
            },
            {
              code: CloneErrorCodes.STORAGE,
              message: "Invalid storage",
              system_id: "ghi789",
            },
            {
              code: CloneErrorCodes.NETWORKING,
              message: "Invalid networking",
              system_id: "def456",
            },
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
    expect(wrapper.find("Table[data-testid='errors-table']").exists()).toBe(
      true
    );
    expect(wrapper.find("TableRow[data-testid='error-row']").length).toBe(2);
  });

  it("can filter machines by error type", () => {
    const setSearchFilter = jest.fn();
    state.machine.eventErrors = [
      eventErrorFactory({
        error: {
          destinations: [
            {
              code: CloneErrorCodes.NETWORKING,
              message: "Invalid networking",
              system_id: "def456",
            },
            {
              code: CloneErrorCodes.NETWORKING,
              message: "Invalid networking",
              system_id: "ghi789",
            },
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
            setSearchFilter={setSearchFilter}
            sourceMachine={machine}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Link[data-testid='error-filter-link']").simulate("click");
    expect(setSearchFilter).toHaveBeenCalledWith("system_id:(def456,ghi789)");
  });

  it("does not show filter links if viewing from machine details", () => {
    const setSearchFilter = jest.fn();
    state.machine.eventErrors = [
      eventErrorFactory({
        error: {
          destinations: [
            {
              code: CloneErrorCodes.NETWORKING,
              message: "Invalid networking",
              system_id: "def456",
            },
            {
              code: CloneErrorCodes.NETWORKING,
              message: "Invalid networking",
              system_id: "ghi789",
            },
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
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CloneResults
            closeForm={jest.fn()}
            destinations={["def456", "ghi789"]}
            setSearchFilter={setSearchFilter}
            sourceMachine={machine}
            viewingDetails
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Link[data-testid='error-filter-link']").exists()).toBe(
      false
    );
  });
});
