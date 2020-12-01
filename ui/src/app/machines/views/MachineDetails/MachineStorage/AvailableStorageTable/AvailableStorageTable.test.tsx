import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AvailableStorageTable from "./AvailableStorageTable";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AvailableStorageTable", () => {
  it("can show an empty message", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("[data-test='no-available']").text()).toBe(
      "No available disks or partitions."
    );
  });

  it("only shows disks that are available", () => {
    const [availableDisk, usedDisk] = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        name: "available-disk",
        filesystem: null,
        type: "physical",
      }),
      diskFactory({
        available_size: MIN_PARTITION_SIZE - 1,
        filesystem: null,
        name: "used-disk",
        type: "physical",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [availableDisk, usedDisk],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("TableCell DoubleRow").at(0).prop("primary")).toBe(
      availableDisk.name
    );
  });

  it("disables action dropdown if storage cannot be edited", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [diskFactory({ available_size: MIN_PARTITION_SIZE + 1 })],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage={false} systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("TableMenu").at(0).prop("disabled")).toBe(true);
  });

  it("can open the add partition form if disk can be partitioned", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: "physical",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AvailableStorageTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper.find("ContextualMenuDropdown button").at(0).simulate("click");

    expect(wrapper.find("AddPartition").exists()).toBe(true);
  });
});
