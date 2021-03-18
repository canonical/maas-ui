import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VMsTable from "./VMsTable";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMsTable", () => {
  it("shows a spinner if machines are loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        loading: true,
      }),
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VMsTable id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can change sort order", () => {
    const [vm1, vm2, vm3] = [
      machineFactory({ hostname: "b", pod: { id: 1, name: "pod" } }),
      machineFactory({ hostname: "c", pod: { id: 1, name: "pod" } }),
      machineFactory({ hostname: "a", pod: { id: 1, name: "pod" } }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [vm1, vm2, vm3],
      }),
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VMsTable id={1} />
        </MemoryRouter>
      </Provider>
    );
    const getName = (index: number) =>
      wrapper.find("[data-test='name-col']").at(index).text();

    // Sorted descending by hostname by default
    expect(getName(0)).toBe("a");
    expect(getName(1)).toBe("b");
    expect(getName(2)).toBe("c");

    // Sorted ascending by hostname
    wrapper.find("[data-test='name-header']").simulate("click");
    expect(getName(0)).toBe("c");
    expect(getName(1)).toBe("b");
    expect(getName(2)).toBe("a");

    // No sort
    wrapper.find("[data-test='name-header']").simulate("click");
    expect(getName(0)).toBe("b");
    expect(getName(1)).toBe("c");
    expect(getName(2)).toBe("a");
  });
});
