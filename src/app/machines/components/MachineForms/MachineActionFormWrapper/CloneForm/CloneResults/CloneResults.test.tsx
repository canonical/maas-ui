import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import CloneResults, { CloneErrorCodes } from "./CloneResults";

import type { MachineDetails } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

describe("CloneResults", () => {
  let state: RootState;
  let machine: MachineDetails;

  beforeEach(() => {
    machine = factory.machineDetails({ system_id: "abc123" });
    state = factory.rootState({
      machine: factory.machineState({ items: [machine], loaded: true }),
    });
  });

  it("handles a successful clone result", () => {
    state.machine.eventErrors = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <CloneResults
              closeForm={vi.fn()}
              selectedCount={2}
              sourceMachine={machine}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText(/2 of 2 machines cloned successfully from/i)
    ).toBeInTheDocument();
    expect(screen.queryByTestId("error-filter-link")).not.toBeInTheDocument();
  });

  it("handles global clone errors", () => {
    state.machine.eventErrors = [
      factory.machineEventError({
        error: "it didn't work",
        event: NodeActions.CLONE,
        id: machine.system_id,
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <CloneResults
              closeForm={vi.fn()}
              selectedCount={2}
              sourceMachine={machine}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText(/0 of 2 machines cloned successfully from/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("error-description")).toHaveTextContent(
      "Cloning was unsuccessful: it didn't work"
    );
  });

  it("handles non-invalid item destination errors", () => {
    state.machine.eventErrors = [
      factory.machineEventError({
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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <CloneResults
              closeForm={vi.fn()}
              selectedCount={2}
              sourceMachine={machine}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText(/1 of 2 machines cloned successfully from/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("error-filter-link")).toHaveAttribute(
      "href",
      "/machines?system_id=def456"
    );
  });

  it("handles invalid item destination errors", () => {
    state.machine.eventErrors = [
      factory.machineEventError({
        error: {
          destinations: [
            {
              code: CloneErrorCodes.ITEM_INVALID,
              message:
                "Machine 1 is invalid: Select a valid choice. def456 is not one of the available choices.",
            },
          ],
        },
        event: NodeActions.CLONE,
        id: machine.system_id,
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <CloneResults
              closeForm={vi.fn()}
              selectedCount={2}
              sourceMachine={machine}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText(/0 of 2 machines cloned successfully from/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("error-filter-link")).toHaveAttribute(
      "href",
      "/machines?system_id=def456"
    );
  });

  it("groups errors by error code", () => {
    state.machine.eventErrors = [
      factory.machineEventError({
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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <CloneResults
              closeForm={vi.fn()}
              selectedCount={2}
              sourceMachine={machine}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("errors-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("error-row").length).toBe(2);
  });

  it("can filter machines by error type", async () => {
    const setSearchFilter = vi.fn();
    state.machine.eventErrors = [
      factory.machineEventError({
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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <CloneResults
              closeForm={vi.fn()}
              setSearchFilter={setSearchFilter}
              sourceMachine={machine}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(screen.getByTestId("error-filter-link"));
    expect(setSearchFilter).toHaveBeenCalledWith("system_id:(def456,ghi789)");
  });

  it("does not show filter links if viewing from machine details", () => {
    const setSearchFilter = vi.fn();
    state.machine.eventErrors = [
      factory.machineEventError({
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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <CloneResults
              closeForm={vi.fn()}
              setSearchFilter={setSearchFilter}
              sourceMachine={machine}
              viewingDetails
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByTestId("error-filter-link")).not.toBeInTheDocument();
  });
});
