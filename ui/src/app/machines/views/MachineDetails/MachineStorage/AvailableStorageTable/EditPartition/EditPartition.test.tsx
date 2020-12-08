import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import EditPartition from "./EditPartition";

import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineEventError as machineEventErrorFactory,
  machinePartition as partitionFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("EditPartition", () => {
  it("can show errors", () => {
    const partition = partitionFactory();
    const disk = diskFactory({ partitions: [partition] });
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: [
          machineEventErrorFactory({
            error: "didn't work",
            event: "updateFilesystem",
            id: "abc123",
          }),
        ],
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
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

    expect(wrapper.find("Notification").text().includes("didn't work")).toBe(
      true
    );
  });

  it("correctly dispatches an action to edit a partition", () => {
    const partition = partitionFactory();
    const disk = diskFactory({ partitions: [partition] });
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
        <EditPartition
          closeExpanded={jest.fn()}
          disk={disk}
          partition={partition}
          systemId="abc123"
        />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      fstype: "fat32",
      mountOptions: "noexec",
      mountPoint: "/path",
    });

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateFilesystem")
    ).toStrictEqual({
      meta: {
        method: "update_filesystem",
        model: "machine",
      },
      payload: {
        params: {
          block_id: disk.id,
          partition_id: partition.id,
          fstype: "fat32",
          mount_options: "noexec",
          mount_point: "/path",
          system_id: "abc123",
        },
      },
      type: "machine/updateFilesystem",
    });
  });
});
