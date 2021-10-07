import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { VMS_PER_PAGE } from "../LXDVMsTable";

import VMsTable from "./VMsTable";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMsTable", () => {
  let getResources: jest.Mock;

  beforeEach(() => {
    getResources = jest.fn().mockReturnValue({
      hugepagesBacked: false,
      pinnedCores: [],
      unpinnedCores: 0,
    });
  });

  it("shows a spinner if machines are loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        loading: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VMsTable
            currentPage={1}
            getResources={getResources}
            searchFilter=""
            vms={[]}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can change sort order", () => {
    const vms = [
      machineFactory({ hostname: "b" }),
      machineFactory({ hostname: "c" }),
      machineFactory({ hostname: "a" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VMsTable
            currentPage={1}
            getResources={getResources}
            searchFilter=""
            vms={vms}
          />
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

  it("can dispatch an action to select all VMs", () => {
    const vms = [
      machineFactory({
        system_id: "abc123",
      }),
      machineFactory({
        system_id: "def456",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
        selected: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VMsTable
            currentPage={1}
            getResources={getResources}
            searchFilter=""
            vms={vms}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("GroupCheckbox input").simulate("change", {
      target: { name: "group-checkbox", value: "checked" },
    });
    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({
      type: "machine/setSelected",
      payload: ["abc123", "def456"],
    });
  });

  it("can dispatch an action to unselect all VMs", () => {
    const vms = [
      machineFactory({
        system_id: "abc123",
      }),
      machineFactory({
        system_id: "def456",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
        selected: ["abc123", "def456"],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VMsTable
            currentPage={1}
            getResources={getResources}
            searchFilter=""
            vms={vms}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("GroupCheckbox input").simulate("change", {
      target: { name: "group-checkbox", value: "checked" },
    });
    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({
      type: "machine/setSelected",
      payload: [],
    });
  });

  it("paginates the VMs", () => {
    // There is 1 more VM than what's shown per page.
    const vms = Array.from(Array(VMS_PER_PAGE + 1)).map((_, i) =>
      machineFactory({
        system_id: `${i}`,
      })
    );
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
      }),
    });
    const store = mockStore(state);
    const Proxy = ({ currentPage }: { currentPage: number }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VMsTable
            currentPage={currentPage}
            getResources={getResources}
            searchFilter=""
            vms={vms}
          />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy currentPage={1} />);
    expect(wrapper.find("tbody tr").length).toBe(VMS_PER_PAGE);

    wrapper.setProps({ currentPage: 2 });
    wrapper.update();
    expect(wrapper.find("tbody tr").length).toBe(1);
  });

  it("shows a message if no VMs match the search filter", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <VMsTable
            currentPage={1}
            getResources={getResources}
            searchFilter="system_id:(=ghi789)"
            vms={[]}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='no-vms']").exists()).toBe(true);
    expect(wrapper.find("[data-test='no-vms']").text()).toBe(
      "No VMs in this VM host match the search criteria."
    );
  });
});
