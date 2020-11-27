import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { scriptStatus } from "app/base/enum";
import { DisksColumn } from "./DisksColumn";

const mockStore = configureStore();

describe("DisksColumn", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
            physical_disk_count: 1,
            storage_test_status: {
              status: 2,
            },
          },
        ],
      },
    };
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
    state.machine.items[0].storage_test_status = {
      status: scriptStatus.FAILED,
    };
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
