import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMsActionBar from "./VMsActionBar";

import { KVMHeaderViews } from "app/kvm/constants";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMsActionBar", () => {
  it("can open the 'Compose VM' form", () => {
    const setHeaderContent = jest.fn();
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          id={1}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setSearchFilter={jest.fn()}
          setHeaderContent={setHeaderContent}
        />
      </Provider>
    );

    wrapper.find("button[data-test='compose-vm']").simulate("click");

    expect(setHeaderContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.COMPOSE_VM,
    });
  });

  it("can open the 'Refresh KVM' form", () => {
    const setHeaderContent = jest.fn();
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          id={1}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setSearchFilter={jest.fn()}
          setHeaderContent={setHeaderContent}
        />
      </Provider>
    );

    wrapper.find("button[data-test='refresh-kvm']").simulate("click");

    expect(setHeaderContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.REFRESH_KVM,
    });
  });

  it("disables VM actions if none are selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        selected: [],
      }),
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          id={1}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setSearchFilter={jest.fn()}
          setHeaderContent={jest.fn()}
        />
      </Provider>
    );

    expect(
      wrapper.find("[data-test='vm-actions'] button").prop("disabled")
    ).toBe(true);
    expect(wrapper.find("button[data-test='delete-vm']").prop("disabled")).toBe(
      true
    );
  });

  it("enables VM actions if at least one is selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({ pod: { id: 1, name: "pod" }, system_id: "abc123" }),
        ],
        selected: ["abc123"],
      }),
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          id={1}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setSearchFilter={jest.fn()}
          setHeaderContent={jest.fn()}
        />
      </Provider>
    );

    expect(
      wrapper.find("[data-test='vm-actions'] button").prop("disabled")
    ).toBe(false);
    expect(wrapper.find("button[data-test='delete-vm']").prop("disabled")).toBe(
      false
    );
  });
});
