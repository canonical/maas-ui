import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SourceMachineSelect from "./SourceMachineSelect";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SourceMachineSelect", () => {
  let machines: Machine[];
  let state: RootState;

  beforeEach(() => {
    machines = [
      machineFactory({
        system_id: "abc123",
        hostname: "first",
        owner: "admin",
        tags: [12],
      }),
      machineFactory({
        system_id: "def456",
        hostname: "second",
        owner: "user",
        tags: [13],
      }),
    ];
    state = rootStateFactory({
      tag: tagStateFactory({
        items: [
          tagFactory({ id: 12, name: "tagA" }),
          tagFactory({ id: 13, name: "tagB" }),
        ],
      }),
    });
  });

  it("shows a spinner while data is loading", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SourceMachineSelect
            loadingData
            machines={machines}
            onMachineClick={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-spinner']").exists()).toBe(true);
  });

  it("shows an error if no machines are available to select", () => {
    const store = mockStore(state);
    const Proxy = ({ machines }: { machines: Machine[] }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SourceMachineSelect machines={machines} onMachineClick={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy machines={[machineFactory()]} />);
    expect(wrapper.find("[data-testid='no-source-machines']").exists()).toBe(
      false
    );

    wrapper.setProps({ machines: [] });
    expect(wrapper.find("[data-testid='no-source-machines']").exists()).toBe(
      true
    );
  });

  it("can filter machines by hostname, system_id and/or tags", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SourceMachineSelect machines={machines} onMachineClick={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    // Filter by "first" which matches the hostname of the first machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "first" } });
    expect(wrapper.find("[data-testid='source-machine-first']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-testid='source-machine-second']").exists()).toBe(
      false
    );

    // Filter by "def" which matches the system_id of the second machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "def" } });
    expect(wrapper.find("[data-testid='source-machine-first']").exists()).toBe(
      false
    );
    expect(wrapper.find("[data-testid='source-machine-second']").exists()).toBe(
      true
    );

    // Filter by "tag" which matches the tags of the first and second machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "tag" } });
    expect(wrapper.find("[data-testid='source-machine-first']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-testid='source-machine-second']").exists()).toBe(
      true
    );
  });

  it("highlights the substring that matches the search text", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SourceMachineSelect machines={machines} onMachineClick={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    // Filter by "fir" which matches part of the hostname of the first machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "fir" } });
    expect(
      wrapper
        .find("[data-testid='source-machine-first']")
        .render()
        .find("strong")
        .text()
    ).toBe("fir");
  });

  it("runs onMachineClick function on row click", () => {
    const onMachineClick = jest.fn();

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SourceMachineSelect
            machines={machines}
            onMachineClick={onMachineClick}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("[data-testid='source-machine-row']").at(0).simulate("click");
    expect(onMachineClick).toHaveBeenCalledWith(machines[0]);
  });

  it("shows the machine's details when selected", () => {
    const selectedMachine = machineDetailsFactory();

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SourceMachineSelect
            machines={machines}
            onMachineClick={jest.fn()}
            selectedMachine={selectedMachine}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("SourceMachineDetails").exists()).toBe(true);
  });

  it("clears the selected machine on search input change", () => {
    const selectedMachine = machineDetailsFactory();
    const onMachineClick = jest.fn();

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SourceMachineSelect
            machines={machines}
            onMachineClick={onMachineClick}
            selectedMachine={selectedMachine}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "" } });
    expect(onMachineClick).toHaveBeenCalledWith(null);
  });

  it("displays tag names", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SourceMachineSelect machines={machines} onMachineClick={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Filter by "first" which matches the hostname of the first machine
    wrapper
      .find("[data-testid='source-machine-searchbox'] input")
      .simulate("change", { target: { value: "first" } });
    expect(wrapper.find("[data-testid='source-machine-tagA']").exists()).toBe(
      true
    );
  });
});
