import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EventLogsTable from "./EventLogsTable";

import type { RootState } from "app/store/root/types";
import {
  eventRecord as eventRecordFactory,
  eventState as eventStateFactory,
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("EventLogsTable", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      event: eventStateFactory({
        items: [
          eventRecordFactory({ id: 101, node_id: 1 }),
          eventRecordFactory({ id: 123, node_id: 2 }),
        ],
      }),
      machine: machineStateFactory({
        items: [machineDetailsFactory({ id: 1, system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner if machine is loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogsTable systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can display a table", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogsTable systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("EventLogsTable").exists()).toBe(true);
  });

  it("orders the rows by most recent first", () => {
    state.event.items = [
      eventRecordFactory({ created: "Tue, 16 Mar. 2021 03:04:00", node_id: 1 }),
      eventRecordFactory({ created: "Tue, 17 Mar. 2021 03:04:00", node_id: 1 }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogsTable systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("td.time-col")
        .first()
        .text()
        .includes("Tue, 17 Mar. 2021 03:04:00")
    ).toBe(true);
    expect(
      wrapper
        .find("td.time-col")
        .last()
        .text()
        .includes("Tue, 16 Mar. 2021 03:04:00")
    ).toBe(true);
  });
});
