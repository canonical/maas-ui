import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import BulkActions from "./BulkActions";

import { DiskTypes } from "app/store/machine/types";
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

describe("BulkActions", () => {
  it("disables create volume group button with tooltip if selected devices are not eligible", () => {
    const selected = [
      diskFactory({
        partitions: [partitionFactory()],
        type: DiskTypes.PHYSICAL,
      }),
    ];
    const wrapper = mount(
      <BulkActions
        bulkAction={null}
        selected={selected}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />
    );

    expect(wrapper.find("button[data-test='create-vg']").prop("disabled")).toBe(
      true
    );
    expect(wrapper.find("[data-test='create-vg-tooltip']").exists()).toBe(true);
  });

  it("enables create volume group button if selected devices are eligible", () => {
    const selected = [
      diskFactory({ partitions: null, type: DiskTypes.PHYSICAL }),
      partitionFactory({ filesystem: null }),
    ];
    const wrapper = mount(
      <BulkActions
        bulkAction={null}
        selected={selected}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />
    );

    expect(wrapper.find("button[data-test='create-vg']").prop("disabled")).toBe(
      false
    );
  });

  it("can render the create volume group form", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
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
        <BulkActions
          bulkAction="createVolumeGroup"
          selected={[]}
          setBulkAction={jest.fn()}
          systemId="abc123"
        />
      </Provider>
    );

    expect(wrapper.find("CreateVolumeGroup").exists()).toBe(true);
  });
});
