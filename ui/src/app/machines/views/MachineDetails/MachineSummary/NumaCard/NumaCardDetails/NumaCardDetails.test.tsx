import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NumaCardDetails from "./NumaCardDetails";

import type { MachineNumaNode } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineNumaNode as machineNumaNodeFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NumaCardDetails", () => {
  let state: RootState;
  let numaNode: MachineNumaNode;
  beforeEach(() => {
    numaNode = machineNumaNodeFactory();
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            numa_nodes: [numaNode],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can display as expanded", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NumaCardDetails
            machineId="abc123"
            numaNode={numaNode}
            showExpanded
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".numa-card__button").exists()).toBe(false);
    expect(wrapper.find(".numa-card__collapsed-details").exists()).toBe(false);
    expect(wrapper.find("NumaCard")).toMatchSnapshot();
  });

  it("can display as collapsed", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NumaCardDetails machineId="abc123" numaNode={numaNode} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".numa-card__button").exists()).toBe(true);
    expect(wrapper.find(".numa-card__collapsed-details").exists()).toBe(true);
  });

  it("can be expanded", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NumaCardDetails machineId="abc123" numaNode={numaNode} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find(".numa-card__button").simulate("click");
    expect(wrapper.find("LabelledList").exists()).toBe(true);
    expect(wrapper.find(".numa-card__collapsed-details").exists()).toBe(false);
  });

  it("shows a border if it is not the last item", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NumaCardDetails
            isLast={false}
            machineId="abc123"
            numaNode={numaNode}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("hr").exists()).toBe(true);
  });

  it("does not show a border if it is the last item", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NumaCardDetails isLast machineId="abc123" numaNode={numaNode} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("hr").exists()).toBe(false);
  });
});
