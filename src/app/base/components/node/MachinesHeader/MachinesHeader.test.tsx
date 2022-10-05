import reduxToolkit from "@reduxjs/toolkit";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachinesHeader from "./MachinesHeader";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStateCount as machineStateCountFactory,
  machineStateCounts as machineStateCountsFactory,
  machineStatus as machineStatusFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachinesHeader", () => {
  let state: RootState;

  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        counts: machineStateCountsFactory({
          "mocked-nanoid": machineStateCountFactory({
            count: 2,
            loaded: true,
            loading: false,
          }),
        }),
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory({}),
          def456: machineStatusFactory({}),
        },
      }),
      resourcepool: resourcePoolStateFactory({
        errors: {},
        loaded: false,
        items: [
          resourcePoolFactory({ id: 0, name: "default" }),
          resourcePoolFactory({ id: 1, name: "other" }),
        ],
      }),
      tag: tagStateFactory({
        loaded: true,
        items: [tagFactory(), tagFactory()],
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("displays machine, resource pool and tag counts if loaded", () => {
    state.machine.loaded = true;
    state.resourcepool.loaded = true;
    state.tag.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <MachinesHeader />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const tabs = wrapper.find('[data-testid="section-header-tabs"]');
    expect(tabs.find("Link").at(0).text()).toBe("2 Machines");
    expect(tabs.find("Link").at(1).text()).toBe("2 Resource pools");
    expect(tabs.find("Link").at(2).text()).toBe("2 Tags");
  });
});
