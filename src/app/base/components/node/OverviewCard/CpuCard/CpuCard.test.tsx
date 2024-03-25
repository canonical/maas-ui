import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import CpuCard from "./CpuCard";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = factory.rootState({
    controller: factory.controllerState({
      items: [],
    }),
    machine: factory.machineState({
      items: [],
    }),
  });
});

it("renders the cpu subtext", () => {
  const machine = factory.machineDetails({ cpu_speed: 2000 });
  state.machine.items = [machine];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <CompatRouter>
          <CpuCard node={machine} setSidePanelContent={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId("cpu-subtext")).toHaveTextContent(
    `${machine.cpu_count} core, 2 GHz`
  );
});

it("renders the cpu subtext for slower CPUs", () => {
  const machine = factory.machineDetails({ cpu_speed: 200 });
  state.machine.items = [machine];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <CompatRouter>
          <CpuCard node={machine} setSidePanelContent={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId("cpu-subtext")).toHaveTextContent(
    `${machine.cpu_count} core, 200 MHz`
  );
});

it("does not render test info if node is a controller", () => {
  const controller = factory.controllerDetails();
  state.controller.items = [controller];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <CpuCard node={controller} />
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
          <CpuCard node={machine} setSidePanelContent={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId("tests")).toBeInTheDocument();
});

describe("node is a machine", () => {
  it("renders a link with a count of passed tests", () => {
    const machine = factory.machineDetails();
    machine.cpu_test_status = factory.testStatus({
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
            <CpuCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
  });

  it("renders a link with a count of pending and running tests", () => {
    const machine = factory.machineDetails();
    machine.cpu_test_status = factory.testStatus({
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
            <CpuCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
  });

  it("renders a link with a count of failed tests", () => {
    const machine = factory.machineDetails();
    machine.cpu_test_status = factory.testStatus({
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
            <CpuCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("link", { name: "5" })).toBeInTheDocument();
  });

  it("renders a results link", () => {
    const machine = factory.machineDetails();
    machine.cpu_test_status = factory.testStatus({
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
            <CpuCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("link", { name: /View results/ })
    ).toBeInTheDocument();
  });

  it("renders a test cpu link if no tests run", () => {
    const machine = factory.machineDetails();
    machine.cpu_test_status = factory.testStatus();
    state.machine.items = [machine];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <CpuCard node={machine} setSidePanelContent={vi.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: /Test CPU/ })
    ).toBeInTheDocument();
  });
});
