import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import CreateRaid from "../CreateRaid";

import type { RootState } from "app/store/root/types";
import { DiskTypes } from "app/store/types/enum";
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

describe("CreateRaidFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
  });

  it("can handle RAID 0 devices", async () => {
    const disks = [
      diskFactory({ available_size: 1000000000 }), // 1GB
      diskFactory({ available_size: 1500000000 }), // 1.5GB
    ];
    state.machine.items[0] = machineDetailsFactory({
      disks,
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <CreateRaid
              closeForm={jest.fn()}
              selected={disks}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    // Select RAID 0
    await act(async () => {
      wrapper.find("FormikField[name='level'] select").simulate("change", {
        target: { name: "level", value: DiskTypes.RAID_0 },
      });
    });
    wrapper.update();

    // RAID 0s should not allow spare devices
    expect(wrapper.find("[data-testid='max-spares']").exists()).toBe(false);
    // RAID 0 size is calculated as (minSize * numActive) = 1GB * 2 disks
    expect(wrapper.find("Input[data-testid='raid-size']").prop("value")).toBe(
      "2 GB"
    );
  });

  it("can handle RAID 1 devices", async () => {
    const disks = [
      diskFactory({ available_size: 1000000000 }), // 1GB
      diskFactory({ available_size: 1500000000 }), // 1.5GB
      diskFactory({ available_size: 2000000000 }), // 2GB
    ];
    state.machine.items[0] = machineDetailsFactory({
      disks,
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <CreateRaid
              closeForm={jest.fn()}
              selected={disks}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    // Select RAID 1
    await act(async () => {
      wrapper.find("FormikField[name='level'] select").simulate("change", {
        target: { name: "level", value: DiskTypes.RAID_1 },
      });
    });
    wrapper.update();

    // RAID 1s allow spare devices, with a minimum of 2 active
    expect(wrapper.find("[data-testid='max-spares']").text()).toBe(
      "Spare (max 1)"
    );
    // RAID 1 size is calculated as (minSize) = 1GB
    expect(wrapper.find("Input[data-testid='raid-size']").prop("value")).toBe(
      "1 GB"
    );
  });

  it("can handle RAID 5 devices", async () => {
    const disks = [
      diskFactory({ available_size: 1000000000 }), // 1GB
      diskFactory({ available_size: 1500000000 }), // 1.5GB
      diskFactory({ available_size: 2000000000 }), // 2GB
      diskFactory({ available_size: 2500000000 }), // 2.5GB
    ];
    state.machine.items[0] = machineDetailsFactory({
      disks,
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <CreateRaid
              closeForm={jest.fn()}
              selected={disks}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    // Select RAID 5
    await act(async () => {
      wrapper.find("FormikField[name='level'] select").simulate("change", {
        target: { name: "level", value: DiskTypes.RAID_5 },
      });
    });
    wrapper.update();

    // RAID 5s allow spare devices, with a minimum of 3 active
    expect(wrapper.find("[data-testid='max-spares']").text()).toBe(
      "Spare (max 1)"
    );
    // RAID 5 size is calculated as minSize * (numActive - 1) = 1GB * (4 - 1)
    expect(wrapper.find("Input[data-testid='raid-size']").prop("value")).toBe(
      "3 GB"
    );
  });

  it("can handle RAID 6 devices", async () => {
    const disks = [
      diskFactory({ available_size: 1000000000 }), // 1GB
      diskFactory({ available_size: 1500000000 }), // 1.5GB
      diskFactory({ available_size: 2000000000 }), // 2GB
      diskFactory({ available_size: 2500000000 }), // 2.5GB
      diskFactory({ available_size: 3000000000 }), // 3GB
    ];
    state.machine.items[0] = machineDetailsFactory({
      disks,
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <CreateRaid
              closeForm={jest.fn()}
              selected={disks}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    // Select RAID 6
    await act(async () => {
      wrapper.find("FormikField[name='level'] select").simulate("change", {
        target: { name: "level", value: DiskTypes.RAID_6 },
      });
    });
    wrapper.update();

    // RAID 6s allow spare devices, with a minimum of 4 active
    expect(wrapper.find("[data-testid='max-spares']").text()).toBe(
      "Spare (max 1)"
    );
    // RAID 6 size is calculated as minSize * (numActive - 2) = 1GB * (5 - 2)
    expect(wrapper.find("Input[data-testid='raid-size']").prop("value")).toBe(
      "3 GB"
    );
  });

  it("can handle RAID 10 devices", async () => {
    const disks = [
      diskFactory({ available_size: 1500000000 }), // 1.5GB
      diskFactory({ available_size: 2000000000 }), // 2GB
      diskFactory({ available_size: 2500000000 }), // 2.5GB
      diskFactory({ available_size: 3000000000 }), // 3GB
    ];
    state.machine.items[0] = machineDetailsFactory({
      disks,
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <CreateRaid
              closeForm={jest.fn()}
              selected={disks}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    // Select RAID 10
    await act(async () => {
      wrapper.find("FormikField[name='level'] select").simulate("change", {
        target: { name: "level", value: DiskTypes.RAID_10 },
      });
    });
    wrapper.update();

    // RAID 10s allow spare devices, with a minimum of 3 active
    expect(wrapper.find("[data-testid='max-spares']").text()).toBe(
      "Spare (max 1)"
    );
    // RAID 10 size is calculated as (minSize * numActive) / 2 = (1.5GB * 4) / 2
    expect(wrapper.find("Input[data-testid='raid-size']").prop("value")).toBe(
      "3 GB"
    );
  });

  it("can handle setting spare disks and partitions", async () => {
    const partitions = [
      partitionFactory({ size: 1000000000 }), // 1GB
      partitionFactory({ size: 1500000000 }), // 1.5GB
    ];
    const disks = [
      diskFactory({ available_size: 2000000000 }), // 2GB
      diskFactory({ available_size: 2500000000 }), // 2.5GB
      diskFactory({ partitions }),
    ];
    state.machine.items[0] = machineDetailsFactory({
      disks,
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <CreateRaid
              closeForm={jest.fn()}
              selected={[disks[0], disks[1], ...partitions]}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const isActive = (i: number) =>
      wrapper
        .find("[data-testid='active-status']")
        .at(i)
        .find("[data-testid='is-active']")
        .exists();
    const isDisabled = (i: number) =>
      wrapper
        .find("[data-testid='spare-storage-device'] input")
        .at(i)
        .prop("disabled");

    // Select RAID 1
    await act(async () => {
      wrapper.find("FormikField[name='level'] select").simulate("change", {
        target: { name: "level", value: DiskTypes.RAID_1 },
      });
    });
    wrapper.update();

    // RAID 1s allow spare devices, with a minimum of 2 active
    expect(wrapper.find("[data-testid='max-spares']").text()).toBe(
      "Spare (max 2)"
    );

    // None of the spare checkboxes should be disabled.
    expect(isDisabled(0)).toBe(false);
    expect(isDisabled(1)).toBe(false);
    expect(isDisabled(2)).toBe(false);
    expect(isDisabled(3)).toBe(false);

    // Check the spare checkboxes for the first disk and first partition
    await act(async () => {
      const diskId = `raid-${disks[0].type}-${disks[0].id}`;
      const partitionId = `raid-${partitions[0].type}-${partitions[0].id}`;
      wrapper.find(`Input[id='${diskId}'] input`).simulate("change", {
        target: {
          id: diskId,
          value: "checked",
        },
      });
      wrapper.find(`Input[id='${partitionId}'] input`).simulate("change", {
        target: {
          id: partitionId,
          value: "checked",
        },
      });
    });
    wrapper.update();

    // First disk and partition should be spare, second disk and partition
    // should be active.
    expect(isActive(0)).toBe(false);
    expect(isActive(1)).toBe(true);
    expect(isActive(2)).toBe(false);
    expect(isActive(3)).toBe(true);

    // Should not be able to select any more spare devices, but should still
    // be able to unselect existing spares.
    expect(isDisabled(0)).toBe(false);
    expect(isDisabled(1)).toBe(true);
    expect(isDisabled(2)).toBe(false);
    expect(isDisabled(3)).toBe(true);
  });

  it("resets block/partition and spare block/partition values on RAID level change", async () => {
    const partitions = [
      partitionFactory({ size: 1000000000 }), // 1GB
      partitionFactory({ size: 1500000000 }), // 1.5GB
    ];
    const disks = [
      diskFactory({ available_size: 2000000000 }), // 2GB
      diskFactory({ available_size: 2500000000 }), // 2.5GB
      diskFactory({ partitions }),
    ];
    state.machine.items[0] = machineDetailsFactory({
      disks,
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <CreateRaid
              closeForm={jest.fn()}
              selected={[disks[0], disks[1], ...partitions]}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const isActive = (i: number) =>
      wrapper
        .find("[data-testid='active-status']")
        .at(i)
        .find("[data-testid='is-active']")
        .exists();

    // Select RAID 1
    await act(async () => {
      wrapper.find("FormikField[name='level'] select").simulate("change", {
        target: { name: "level", value: DiskTypes.RAID_1 },
      });
    });
    wrapper.update();

    // Check the spare checkboxes for the first disk and first partition
    await act(async () => {
      const diskId = `raid-${disks[0].type}-${disks[0].id}`;
      const partitionId = `raid-${partitions[0].type}-${partitions[0].id}`;
      wrapper.find(`Input[id='${diskId}'] input`).simulate("change", {
        target: {
          id: diskId,
          value: "checked",
        },
      });
      wrapper.find(`Input[id='${partitionId}'] input`).simulate("change", {
        target: {
          id: partitionId,
          value: "checked",
        },
      });
    });
    wrapper.update();

    // First disk and partition should be spare, second disk and partition
    // should be active
    expect(isActive(0)).toBe(false);
    expect(isActive(1)).toBe(true);
    expect(isActive(2)).toBe(false);
    expect(isActive(3)).toBe(true);

    // Change to RAID 5
    await act(async () => {
      wrapper.find("FormikField[name='level'] select").simulate("change", {
        target: { name: "level", value: DiskTypes.RAID_5 },
      });
    });
    wrapper.update();

    // All should be reset to active.
    expect(isActive(0)).toBe(true);
    expect(isActive(1)).toBe(true);
    expect(isActive(2)).toBe(true);
    expect(isActive(3)).toBe(true);
  });
});
