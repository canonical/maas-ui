import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import UsedStorageTable from "./UsedStorageTable";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("UsedStorageTable", () => {
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
        <UsedStorageTable systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("[data-test='no-used']").text()).toBe(
      "No disk or partition has been fully utilised."
    );
  });

  it("only shows disks that are being used", () => {
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
        <UsedStorageTable systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("TableCell DoubleRow").at(0).prop("primary")).toBe(
      usedDisk.name
    );
  });
});
