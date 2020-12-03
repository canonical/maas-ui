import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import EditPartition from "../EditPartition";

import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machinePartition as partitionFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("EditPartitionFields", () => {
  it("renders mount point and options if filesystem type is selected", async () => {
    const partition = partitionFactory();
    const disk = diskFactory({ partitions: [partition] });
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
        <EditPartition
          closeExpanded={jest.fn()}
          disk={disk}
          partition={partition}
          systemId="abc123"
        />
      </Provider>
    );

    // Select a filesystem type
    await act(async () => {
      wrapper
        .find("select[name='fstype']")
        .props()
        .onChange({
          target: { name: "fstype", value: "fat32" },
        } as React.ChangeEvent<HTMLSelectElement>);
    });
    wrapper.update();

    expect(wrapper.find("Input[name='mountOptions']").exists()).toBe(true);
    expect(wrapper.find("Input[name='mountPoint']").exists()).toBe(true);
  });
});
