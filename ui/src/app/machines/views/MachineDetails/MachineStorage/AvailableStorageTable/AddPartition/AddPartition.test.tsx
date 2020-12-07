import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AddPartition from "./AddPartition";

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

describe("AddPartition", () => {
  it("sets the partition name correctly", () => {
    const disk = diskFactory({
      id: 1,
      name: "floppy-disk",
      partitions: [partitionFactory(), partitionFactory()],
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
        <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("Input[label='Name']").prop("value")).toBe(
      "floppy-disk-part3"
    );
  });

  it("can show errors", () => {
    const disk = diskFactory();
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: [
          machineEventErrorFactory({
            error: "it's broken",
            event: "createPartition",
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
        <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("Notification").text().includes("it's broken")).toBe(
      true
    );
  });

  it("correctly dispatches an action to create a partition", () => {
    const disk = diskFactory({ id: 1 });
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
        <AddPartition closeExpanded={jest.fn()} disk={disk} systemId="abc123" />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      filesystemType: "fat32",
      mountOptions: "noexec",
      mountPoint: "/path",
      partitionSize: 5,
      unit: "GB",
    });

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createPartition")
    ).toStrictEqual({
      meta: {
        method: "create_partition",
        model: "machine",
      },
      payload: {
        params: {
          block_id: 1,
          fstype: "fat32",
          mount_options: "noexec",
          mount_point: "/path",
          partition_size: 5000000000,
          system_id: "abc123",
        },
      },
      type: "machine/createPartition",
    });
  });
});
