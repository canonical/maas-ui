import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { DisksColumn } from "./DisksColumn";

import type { RootState } from "app/store/root/types";
import { TestStatusStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DisksColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            physical_disk_count: 1,
            storage_test_status: testStatusFactory({
              status: 2,
            }),
          }),
        ],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DisksColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("DisksColumn")).toMatchSnapshot();
  });

  it("displays the physical disk count", () => {
    state.machine.items[0].physical_disk_count = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DisksColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="disks"]').text()).toEqual("2");
  });

  it("correctly shows error icon and tooltip if storage tests failed", () => {
    state.machine.items[0].storage_test_status = testStatusFactory({
      status: TestStatusStatus.FAILED,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DisksColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(".p-icon--error").exists()).toEqual(true);
    expect(wrapper.find("Tooltip").exists()).toBe(true);
  });
});
