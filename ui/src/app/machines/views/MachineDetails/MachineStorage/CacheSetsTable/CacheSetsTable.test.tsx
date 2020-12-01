import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CacheSetsTable from "./CacheSetsTable";

import {
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CacheSetsTable", () => {
  it("only shows disks that are cache sets", () => {
    const [cacheSet, notCacheSet] = [
      diskFactory({
        name: "quiche",
        type: "cache-set",
      }),
      diskFactory({
        name: "frittata",
        type: "physical",
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
        <CacheSetsTable systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("tbody TableRow").length).toBe(1);
    expect(wrapper.find("TableCell").at(0).text()).toBe(cacheSet.name);
  });
});
