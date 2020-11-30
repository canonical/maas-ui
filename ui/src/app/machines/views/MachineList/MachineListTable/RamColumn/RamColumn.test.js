import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { RamColumn } from "./RamColumn";
import { scriptStatus } from "app/base/enum";

const mockStore = configureStore();

describe("RamColumn", () => {
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
            memory: 8,
            memory_test_status: {
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
          <RamColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("RamColumn")).toMatchSnapshot();
  });

  it("displays ram amount", () => {
    state.machine.items[0].memory = 16;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <RamColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="memory"]').text()).toEqual("16");
  });

  it("displays an error and tooltip if memory tests have failed", () => {
    state.machine.items[0].memory = 16;
    state.machine.items[0].memory_test_status = { status: scriptStatus.FAILED };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <RamColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Tooltip").exists()).toBe(true);
    expect(wrapper.find(".p-icon--error").exists()).toBe(true);
  });
});
