import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StorageCard from "./StorageCard";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = factory.rootState({
    controller: factory.controllerState({
      items: [],
    }),
    machine: factory.machineState(),
  });
});

it("does not render test info if node is a controller", () => {
  const controller = factory.controllerDetails();
  state.controller.items = [controller];

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <StorageCard node={controller} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByTestId("tests")).not.toBeInTheDocument();
});

it("renders test info if node is a machine", () => {
  const machine = factory.machineDetails();
  state.machine.items = [machine];

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <StorageCard node={machine} setSidePanelContent={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("tests")).toBeInTheDocument();
});

describe("node is a machine", () => {
  it("renders a link with a count of passed tests", () => {
    const machine = factory.machineDetails();
    machine.storage_test_status = factory.testStatus({
      passed: 2,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <StorageCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });

  it("renders a link with a count of pending and running tests", () => {
    const machine = factory.machineDetails();
    machine.storage_test_status = factory.testStatus({
      running: 1,
      pending: 2,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <StorageCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/3/i)).toBeInTheDocument();
  });

  it("renders a link with a count of failed tests", () => {
    const machine = factory.machineDetails();
    machine.storage_test_status = factory.testStatus({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <StorageCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });

  it("renders a results link", () => {
    const machine = factory.machineDetails();
    machine.storage_test_status = factory.testStatus({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <StorageCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/view results/i)).toBeInTheDocument();
  });

  it("renders a test storage link if no tests run", () => {
    const machine = factory.machineDetails();
    machine.storage_test_status = factory.testStatus();
    state.machine.items = [machine];

    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <StorageCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/test storage/i)).toBeInTheDocument();
  });
});
