import React from "react";

import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import TestResults from "./TestResults";

import { HardwareType } from "app/base/enum";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";
import { screen } from "testing/utils";

const mockStore = configureStore();

describe("TestResults", () => {
  let state;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory(),
    });
  });

  it("renders a link with a count of passed cpu tests", () => {
    const machine = machineDetailsFactory();
    machine.cpu_test_status = testStatusFactory({
      passed: 2,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.CPU}
        machine={machine}
        setSidePanelContent={jest.fn()}
      />,
      {
        route: "/machine/abc123",
        store,
      }
    );

    expect(
      screen.getByTestId("tests").children[0].firstChild
    ).toHaveTextContent("2");
  });

  it("renders a link with a count of pending and running memory tests", () => {
    const machine = machineDetailsFactory();
    machine.memory_test_status = testStatusFactory({
      running: 1,
      pending: 2,
    });
    state.machine.items = [machine];

    const store = mockStore(state);

    const wrapper = renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.Memory}
        machine={machine}
        setSidePanelContent={jest.fn()}
      />,
      {
        route: "/machine/abc123",
        store,
      }
    );

    expect(
      screen.getByTestId("tests").children[0].firstChild
    ).toHaveTextContent("3");
  });

  it("renders a link with a count of failed storage tests", () => {
    const machine = machineDetailsFactory();
    machine.storage_test_status = testStatusFactory({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);

    const wrapper = renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.Storage}
        machine={machine}
        setSidePanelContent={jest.fn()}
      />,
      {
        route: "/machine/abc123",
        store,
      }
    );
    expect(
      screen.getByTestId("tests").children[0].firstChild
    ).toHaveTextContent("5");
  });

  it("renders a results link", () => {
    const machine = machineDetailsFactory();
    machine.cpu_test_status = testStatusFactory({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);

    const wrapper = renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.CPU}
        machine={machine}
        setSidePanelContent={jest.fn()}
      />,
      {
        route: "/machine/abc123",
        store,
      }
    );
    expect(
      screen.getByTestId("tests").children[1].firstChild
    ).toHaveTextContent("View results");
  });

  it("renders a test network link if no tests run", () => {
    const machine = machineDetailsFactory();
    machine.network_test_status = testStatusFactory();
    state.machine.items = [machine];

    const store = mockStore(state);

    const wrapper = renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.Network}
        machine={machine}
        setSidePanelContent={jest.fn()}
      />,
      {
        route: "/machine/abc123",
        store,
      }
    );
    expect(
      screen.getByTestId("tests").children[0].firstChild
    ).toHaveTextContent("Test network");
  });
});
