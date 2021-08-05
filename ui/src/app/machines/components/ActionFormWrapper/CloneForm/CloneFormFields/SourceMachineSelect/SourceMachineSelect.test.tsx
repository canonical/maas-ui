import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SourceMachineSelect from "./SourceMachineSelect";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SourceMachineSelect", () => {
  let state: RootState;
  let firstMachine: Machine;
  let secondMachine: Machine;

  beforeEach(() => {
    firstMachine = machineFactory({
      system_id: "abc123",
      hostname: "first",
      owner: "admin",
      tags: ["tag1"],
    });
    secondMachine = machineFactory({
      system_id: "def456",
      hostname: "second",
      owner: "user",
      tags: ["tag2"],
    });
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [firstMachine, secondMachine],
        loaded: true,
        active: null,
        selected: [],
      }),
    });
  });

  it("dispatches action to fetch machines on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <SourceMachineSelect source="" setSource={jest.fn()} />
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "machine/fetch")
    ).toBe(true);
  });

  it("shows a spinner while machines are loading", () => {
    state.machine.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SourceMachineSelect source="" setSource={jest.fn()} />
      </Provider>
    );

    expect(wrapper.find("[data-test='loading-spinner']").exists()).toBe(true);
  });

  it("can filter machines by hostname, system_id and/or tags", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SourceMachineSelect source="" setSource={jest.fn()} />
      </Provider>
    );

    // Filter by "first" which matches the hostname of the first machine
    wrapper
      .find("[data-test='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "first" } });
    expect(wrapper.find("[data-test='source-machine-first']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-test='source-machine-second']").exists()).toBe(
      false
    );

    // Filter by "def" which matches the system_id of the second machine
    wrapper
      .find("[data-test='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "def" } });
    expect(wrapper.find("[data-test='source-machine-first']").exists()).toBe(
      false
    );
    expect(wrapper.find("[data-test='source-machine-second']").exists()).toBe(
      true
    );

    // Filter by "tag" which matches the tags of the first and second machine
    wrapper
      .find("[data-test='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "tag" } });
    expect(wrapper.find("[data-test='source-machine-first']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-test='source-machine-second']").exists()).toBe(
      true
    );
  });

  it("highlights the substring that matches the search text", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SourceMachineSelect source="" setSource={jest.fn()} />
      </Provider>
    );

    // Filter by "fir" which matches part of the hostname of the first machine
    wrapper
      .find("[data-test='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "fir" } });
    expect(
      wrapper
        .find("[data-test='source-machine-first']")
        .render()
        .find("strong")
        .text()
    ).toBe("fir");
  });

  it("sets the source on row click", () => {
    const setSource = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SourceMachineSelect source="" setSource={setSource} />
      </Provider>
    );

    wrapper.find("[data-test='source-machine-row']").at(0).simulate("click");
    expect(setSource).toHaveBeenCalledWith(firstMachine.system_id);
  });

  it("shows the machine's details when selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SourceMachineSelect source="abc123" setSource={jest.fn()} />
      </Provider>
    );

    expect(
      wrapper.find("[data-test='selected-machine-details']").exists()
    ).toBe(true);
  });

  it("clears the source on search input change", () => {
    const setSource = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SourceMachineSelect source="abc123" setSource={setSource} />
      </Provider>
    );

    wrapper
      .find("[data-test='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "" } });
    expect(setSource).toHaveBeenCalledWith(null);
  });
});
