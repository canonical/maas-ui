import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StorageCard from "./StorageCard";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StorageCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory(),
    });
  });

  it("renders a link with a count of passed tests", () => {
    const machine = machineDetailsFactory();
    machine.storage_test_status = testStatusFactory({
      passed: 2,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
    ).toEqual("2");
  });

  it("renders a link with a count of pending and running tests", () => {
    const machine = machineDetailsFactory();
    machine.storage_test_status = testStatusFactory({
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
          <StorageCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
    ).toEqual("3");
  });

  it("renders a link with a count of failed tests", () => {
    const machine = machineDetailsFactory();
    machine.storage_test_status = testStatusFactory({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
    ).toEqual("5");
  });

  it("renders a results link", () => {
    const machine = machineDetailsFactory();
    machine.storage_test_status = testStatusFactory({
      failed: 5,
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(1).find("Link").text()
    ).toContain("View results");
  });

  it("renders a test storage link if no tests run", () => {
    const machine = machineDetailsFactory();
    machine.storage_test_status = testStatusFactory();
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StorageCard machine={machine} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='tests']").childAt(0).find("Button").text()
    ).toContain("Test storage");
  });
});
