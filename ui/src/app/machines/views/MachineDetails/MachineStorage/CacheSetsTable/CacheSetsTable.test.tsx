import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CacheSetsTable from "./CacheSetsTable";

import { DiskTypes } from "app/store/machine/types";
import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CacheSetsTable", () => {
  it("only shows disks that are cache sets", () => {
    const [cacheSet, notCacheSet] = [
      diskFactory({
        name: "quiche",
        type: DiskTypes.CACHE_SET,
      }),
      diskFactory({
        name: "frittata",
        type: DiskTypes.PHYSICAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [cacheSet, notCacheSet],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CacheSetsTable canEditStorage systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("TableCell").at(0).text()).toBe(cacheSet.name);
  });

  it("can delete a cache set", () => {
    const disk = diskFactory({
      type: DiskTypes.CACHE_SET,
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
        <CacheSetsTable canEditStorage systemId="abc123" />
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
      "Are you sure you want to remove this cache set?"
    );
    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/deleteCacheSet")
    ).toStrictEqual({
      meta: {
        method: "delete_cache_set",
        model: "machine",
      },
      payload: {
        params: {
          cache_set_id: disk.id,
          system_id: "abc123",
        },
      },
      type: "machine/deleteCacheSet",
    });
  });
});
