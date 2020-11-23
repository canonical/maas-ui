import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MemoryCard from "./MemoryCard";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";

import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("MemoryCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
  });

  it("renders a link with a count of passed tests", () => {
    const machine = machineDetailsFactory();
    machine.memory_test_status = testStatusFactory({
      passed: 2,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MemoryCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
    ).toEqual("2");
  });

  it("renders a link with a count of pending and running tests", () => {
    const machine = machineDetailsFactory();
    machine.memory_test_status = testStatusFactory({
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
          <MemoryCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
    ).toEqual("3");
  });

  it("renders a link with a count of failed tests", () => {
    const machine = machineDetailsFactory();
    machine.memory_test_status = testStatusFactory({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MemoryCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
    ).toEqual("5");
  });

  it("renders a results link", () => {
    const machine = machineDetailsFactory();
    machine.memory_test_status = testStatusFactory({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MemoryCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(1).find("Link").text()
    ).toContain("View results");
  });

  it("renders a test cpu link if no tests run", () => {
    const machine = machineDetailsFactory();
    machine.memory_test_status = testStatusFactory();
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MemoryCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(0).find("Button").text()
    ).toContain("Test memory");
  });
});
