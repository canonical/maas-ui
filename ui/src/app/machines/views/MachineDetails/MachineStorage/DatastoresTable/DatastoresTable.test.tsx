import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DatastoresTable from "./DatastoresTable";

import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DatastoresTable", () => {
  it("only shows filesystems that are VMFS6 datastores", () => {
    const [datastore, notDatastore] = [
      fsFactory({ fstype: "vmfs6" }),
      fsFactory({ fstype: "fat32" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [
              diskFactory({ name: "datastore", filesystem: datastore }),
              diskFactory({ name: "not-datastore", filesystem: notDatastore }),
            ],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DatastoresTable systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("TableCell").at(0).text()).toBe("datastore");
  });
});
