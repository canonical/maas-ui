import React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AddPartition from "../AddPartition";

import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddPartitionFields", () => {
  it("renders mount point and options if filesystem type is selected", async () => {
    const disk = diskFactory();
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [disk],
            supported_filesystems: [{ key: "fat32", ui: "fat32" }],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AddPartition
          closeExpanded={jest.fn()}
          diskId={disk.id}
          systemId="abc123"
        />
      </Provider>
    );

    // Select a filesystem type
    await act(async () => {
      wrapper
        .find("select[name='filesystemType']")
        .props()
        .onChange({
          target: { name: "filesystemType", value: "fat32" },
        } as React.ChangeEvent<HTMLSelectElement>);
    });
    wrapper.update();

    expect(wrapper.find("Input[name='mountOptions']").exists()).toBe(true);
    expect(wrapper.find("Input[name='mountPoint']").exists()).toBe(true);
  });
});
