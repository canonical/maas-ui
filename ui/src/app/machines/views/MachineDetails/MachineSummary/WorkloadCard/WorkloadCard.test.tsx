import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import WorkloadCard from "./WorkloadCard";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("WorkloadCard", () => {
  it("displays a message if the machine has no workload annotations", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            workload_annotations: {},
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <WorkloadCard id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='no-workload-annotations']").exists()).toBe(
      true
    );
  });

  it("can display a list of workload annotations", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            workload_annotations: {
              key1: "value1",
              key2: "value2",
            },
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <WorkloadCard id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='workload-annotations'] li").length).toBe(
      2
    );
    expect(wrapper.find("[data-test='workload-key']").at(0).text()).toBe(
      "key1"
    );
    expect(wrapper.find("[data-test='workload-value']").at(0).text()).toBe(
      "value1"
    );
  });

  it("displays comma-separated values on new lines", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            workload_annotations: {
              separated: "comma,separated,value",
            },
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <WorkloadCard id="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='workload-value'] div").at(0).text()).toBe(
      "comma"
    );
    expect(wrapper.find("[data-test='workload-value'] div").at(1).text()).toBe(
      "separated"
    );
    expect(wrapper.find("[data-test='workload-value'] div").at(2).text()).toBe(
      "value"
    );
  });
});
