import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddPartition from "./AddPartition";

import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machinePartition as partitionFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

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
        <MemoryRouter>
          <CompatRouter>
            <AddPartition
              closeExpanded={jest.fn()}
              disk={disk}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Input[label='Name']").prop("value")).toBe(
      "floppy-disk-part3"
    );
  });

  it("sets the initial size to the available space", () => {
    const disk = diskFactory({
      available_size: 8000000000,
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
        <MemoryRouter>
          <CompatRouter>
            <AddPartition
              closeExpanded={jest.fn()}
              disk={disk}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input[name='partitionSize']").prop("value")).toBe(8);
  });

  it("can validate if the size meets the minimum requirement", async () => {
    const disk = diskFactory({
      available_size: 1000000000, // 1GB
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
        <MemoryRouter>
          <CompatRouter>
            <AddPartition
              closeExpanded={jest.fn()}
              disk={disk}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    // Set partition size to 0.1MB
    await act(async () => {
      wrapper.find("input[name='partitionSize']").simulate("change", {
        target: { name: "partitionSize", value: "0.1" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    wrapper.update();
    await act(async () => {
      wrapper.find("select[name='unit']").simulate("change", {
        target: { name: "unit", value: "MB" },
      });
    });
    wrapper.update();

    expect(
      wrapper
        .find(".p-form-validation__message")
        .text()
        .includes("is required to partition this disk")
    ).toBe(true);
  });

  it("can validate if the size is less than available disk space", async () => {
    const disk = diskFactory({
      available_size: 1000000000, // 1GB
      id: 1,
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
        <MemoryRouter>
          <CompatRouter>
            <AddPartition
              closeExpanded={jest.fn()}
              disk={disk}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    // Set logical volume size to 2GB
    await act(async () => {
      wrapper.find("input[name='partitionSize']").simulate("change", {
        target: { name: "partitionSize", value: "2" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    wrapper.update();

    expect(
      wrapper
        .find(".p-form-validation__message")
        .text()
        .includes("available in this disk")
    ).toBe(true);
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
        <MemoryRouter>
          <CompatRouter>
            <AddPartition
              closeExpanded={jest.fn()}
              disk={disk}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper, {
      fstype: "fat32",
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
