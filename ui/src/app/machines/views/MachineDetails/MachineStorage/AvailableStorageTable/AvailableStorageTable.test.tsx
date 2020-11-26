import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { separateStorageData } from "../utils";

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
    const wrapper = mount(
      <AvailableStorageTable
        canEditStorage
        storageDevices={[]}
        systemId="abc123"
      />
    );

    expect(wrapper.find("[data-test='no-available']").text()).toBe(
      "No available disks or partitions."
    );
  });

  it("disables action dropdown if storage cannot be edited", () => {
    const disk = diskFactory({ available_size: MIN_PARTITION_SIZE + 1 });
    const { available } = separateStorageData([disk]);
    const wrapper = mount(
      <AvailableStorageTable
        canEditStorage={false}
        storageDevices={available}
        systemId="abc123"
      />
    );

    expect(wrapper.find("TableMenu").at(0).prop("disabled")).toBe(true);
  });

  it("can open the add partition form if disk can be partitioned", () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      type: "physical",
    });
    const { available } = separateStorageData([disk]);
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
        <AvailableStorageTable
          canEditStorage
          storageDevices={available}
          systemId="abc123"
        />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper.find("ContextualMenuDropdown button").at(0).simulate("click");

    expect(wrapper.find("AddPartition").exists()).toBe(true);
  });
});
