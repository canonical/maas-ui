import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import CpuCard from "./CpuCard";

import type { RootState } from "app/store/root/types";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = rootStateFactory({
    controller: controllerStateFactory({
      items: [],
    }),
    machine: machineStateFactory({
      items: [],
    }),
  });
});

it("renders the cpu subtext", () => {
  const machine = machineDetailsFactory({ cpu_speed: 2000 });
  state.machine.items = [machine];

  const store = mockStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <CompatRouter>
          <CpuCard node={machine} setSidePanelContent={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(wrapper.find("[data-testid='cpu-subtext']").text()).toEqual(
    `${machine.cpu_count} core, 2 GHz`
  );
});

it("renders the cpu subtext for slower CPUs", () => {
  const machine = machineDetailsFactory({ cpu_speed: 200 });
  state.machine.items = [machine];

  const store = mockStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <CompatRouter>
          <CpuCard node={machine} setSidePanelContent={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(wrapper.find("[data-testid='cpu-subtext']").text()).toEqual(
    `${machine.cpu_count} core, 200 MHz`
  );
});

it("does not render test info if node is a controller", () => {
  const controller = controllerDetailsFactory();
  state.controller.items = [controller];

  const store = mockStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <CpuCard node={controller} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(wrapper.find("[data-testid='tests']").exists()).toBe(false);
});

it("renders test info if node is a machine", () => {
  const machine = machineDetailsFactory();
  state.machine.items = [machine];

  const store = mockStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <CpuCard node={machine} setSidePanelContent={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(wrapper.find("[data-testid='tests']").exists()).toBe(true);
});

describe("node is a machine", () => {
  it("renders a link with a count of passed tests", () => {
    const machine = machineDetailsFactory();
    machine.cpu_test_status = testStatusFactory({
      passed: 2,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <CpuCard node={machine} setSidePanelContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='tests']").childAt(0).find("Link").text()
    ).toEqual("2");
  });

  it("renders a link with a count of pending and running tests", () => {
    const machine = machineDetailsFactory();
    machine.cpu_test_status = testStatusFactory({
      running: 1,
      pending: 2,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <CpuCard node={machine} setSidePanelContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='tests']").childAt(0).find("Link").text()
    ).toEqual("3");
  });

  it("renders a link with a count of failed tests", () => {
    const machine = machineDetailsFactory();
    machine.cpu_test_status = testStatusFactory({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <CpuCard node={machine} setSidePanelContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='tests']").childAt(0).find("Link").text()
    ).toEqual("5");
  });

  it("renders a results link", () => {
    const machine = machineDetailsFactory();
    machine.cpu_test_status = testStatusFactory({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <CpuCard node={machine} setSidePanelContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='tests']").childAt(1).find("Link").text()
    ).toContain("View results");
  });

  it("renders a test cpu link if no tests run", () => {
    const machine = machineDetailsFactory();
    machine.cpu_test_status = testStatusFactory();
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <CpuCard node={machine} setSidePanelContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='tests']").childAt(0).find("Button").text()
    ).toContain("Test CPU");
  });
});
