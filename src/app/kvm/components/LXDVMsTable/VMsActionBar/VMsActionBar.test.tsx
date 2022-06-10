import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMsActionBar from "./VMsActionBar";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMsActionBar", () => {
  it("executes onRefreshClick on refresh button click", () => {
    const onRefreshClick = jest.fn();
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          onRefreshClick={onRefreshClick}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setSearchFilter={jest.fn()}
          setHeaderContent={jest.fn()}
          vms={[]}
        />
      </Provider>
    );

    wrapper.find("button[data-testid='refresh-kvm']").simulate("click");

    expect(onRefreshClick).toHaveBeenCalled();
  });

  it("disables VM actions if none are selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        selected: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          onRefreshClick={jest.fn()}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setSearchFilter={jest.fn()}
          setHeaderContent={jest.fn()}
          vms={[]}
        />
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='vm-actions'] button").prop("disabled")
    ).toBe(true);
    expect(
      wrapper.find("button[data-testid='delete-vm']").prop("disabled")
    ).toBe(true);
  });

  it("enables VM actions if at least one is selected", () => {
    const vms = [machineFactory({ system_id: "abc123" })];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: vms,
        selected: ["abc123"],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsActionBar
          currentPage={1}
          onRefreshClick={jest.fn()}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setSearchFilter={jest.fn()}
          setHeaderContent={jest.fn()}
          vms={vms}
        />
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='vm-actions'] button").prop("disabled")
    ).toBe(false);
    expect(
      wrapper.find("button[data-testid='delete-vm']").prop("disabled")
    ).toBe(false);
  });
});
