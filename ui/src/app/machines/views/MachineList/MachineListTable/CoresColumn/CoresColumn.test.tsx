import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { CoresColumn } from "./CoresColumn";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CoresColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            architecture: "amd64/generic",
            cpu_count: 4,
            cpu_test_status: testStatusFactory({
              status: 1,
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
          <CoresColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("CoresColumn")).toMatchSnapshot();
  });

  it("displays the number of cores", () => {
    state.machine.items[0].cpu_count = 8;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CoresColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="cores"]').text()).toEqual("8");
  });

  it("truncates architecture", () => {
    state.machine.items[0].architecture = "i386/generic";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CoresColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="arch"]').text()).toEqual("i386");
  });

  it("displays a Tooltip with the full architecture", () => {
    state.machine.items[0].architecture = "amd64/generic";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CoresColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Tooltip").prop("message")).toEqual("amd64/generic");
  });
});
