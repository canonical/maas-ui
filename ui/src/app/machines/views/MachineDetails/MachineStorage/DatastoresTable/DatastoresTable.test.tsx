import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DatastoresTable from "./DatastoresTable";

import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
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
        <DatastoresTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("TableCell").at(0).text()).toBe("datastore");
  });

  it("can remove a datastore", () => {
    const datastore = fsFactory({ fstype: "vmfs6" });
    const disk = diskFactory({ filesystem: datastore });
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
        <DatastoresTable canEditStorage systemId="abc123" />
      </Provider>
    );

    wrapper.find("TableMenu button").at(0).simulate("click");
    wrapper
      .findWhere(
        (button) =>
          button.name() === "button" && button.text().includes("Remove")
      )
      .simulate("click");
    wrapper.find("ActionButton").simulate("click");

    expect(wrapper.find("ActionConfirm").prop("message")).toBe(
      "Are you sure you want to remove this datastore? ESXi requires at least one VMFS datastore to deploy."
    );
    expect(
      store.getActions().find((action) => action.type === "machine/deleteDisk")
    ).toStrictEqual({
      meta: {
        method: "delete_disk",
        model: "machine",
      },
      payload: {
        params: {
          block_id: disk.id,
          system_id: "abc123",
        },
      },
      type: "machine/deleteDisk",
    });
  });
});
