import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EventLogs from "./EventLogs";

import type { RootState } from "app/store/root/types";
import {
  eventRecord as eventRecordFactory,
  eventState as eventStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("EventLogs", () => {
  let state: RootState;
  let scrollToSpy: jest.Mock;

  beforeEach(() => {
    scrollToSpy = jest.fn();
    global.scrollTo = scrollToSpy;
    state = rootStateFactory({
      event: eventStateFactory({
        items: [
          eventRecordFactory({ node_id: 1 }),
          eventRecordFactory({ node_id: 2 }),
        ],
      }),
      machine: machineStateFactory({
        items: [machineDetailsFactory({ id: 1, system_id: "abc123" })],
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("displays a spinner if machine is loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can display the table", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("EventLogsTable").exists()).toBe(true);
  });

  it("fetches the events from the last day", () => {
    // Create more than the preload amount of events.
    for (let i = 0; i < 203; i++) {
      state.event.items.push(
        eventRecordFactory({
          node_id: 1,
          created: "Tue, 16 Mar. 2021 03:04:00",
        })
      );
    }
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    const dispatches = store
      .getActions()
      .filter(({ type }) => type === "event/fetch");
    expect(dispatches.length).toBe(1);
    expect(dispatches[0].payload).toStrictEqual({
      params: {
        max_days: 1,
        node_id: 1,
      },
    });
  });

  it("fetches more events if the first day contains less than the preload amount", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    const dispatches = store
      .getActions()
      .filter(({ type }) => type === "event/fetch");
    expect(dispatches.length).toBe(2);
    expect(dispatches[1].payload).toStrictEqual({
      params: {
        limit: 201,
        node_id: 1,
      },
    });
  });

  it("fetches more events when the last page is reached", () => {
    // Create more than the preload amount of events.
    state.event.items = [];
    for (let i = 0; i < 203; i++) {
      state.event.items.push(
        eventRecordFactory({
          node_id: 1,
          created: "Tue, 16 Mar. 2021 03:04:00",
        })
      );
    }
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    let dispatches = store
      .getActions()
      .filter(({ type }) => type === "event/fetch");
    expect(dispatches.length).toBe(1);
    act(() => {
      wrapper.find("ArrowPagination").props().setCurrentPage(9);
    });
    dispatches = store
      .getActions()
      .filter(({ type }) => type === "event/fetch");
    expect(dispatches.length).toBe(2);
    expect(dispatches[1].payload).toStrictEqual({
      params: {
        limit: 201,
        node_id: 1,
        start: state.event.items[202].id,
      },
    });
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
          <EventLogs systemId="abc123" />
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

  it("can filter the events", async () => {
    state.event.items = [
      eventRecordFactory({ description: "Failed commissioning", node_id: 1 }),
      eventRecordFactory({ description: "Didn't fail", node_id: 1 }),
      eventRecordFactory({ description: "Failed install", node_id: 1 }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("SearchBox").props().onChange("failed");
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("EventLogsTable").prop("events").length).toBe(2);
    expect(
      wrapper
        .find("td.event-col")
        .first()
        .text()
        .includes("Failed commissioning")
    ).toBe(true);
    expect(
      wrapper.find("td.event-col").last().text().includes("Failed install")
    ).toBe(true);
  });

  it("can update the number of events per page", async () => {
    for (let i = 0; i < 203; i++) {
      state.event.items.push(
        eventRecordFactory({
          node_id: 1,
          created: "Tue, 16 Mar. 2021 03:04:00",
        })
      );
    }
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("EventLogsTable").prop("events").length).toBe(25);
    wrapper.find("select[name='page-size']").simulate("change", {
      target: {
        name: "page-size",
        value: "50",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("EventLogsTable").prop("events").length).toBe(50);
  });

  it("can restore the events per page from local storage", async () => {
    for (let i = 0; i < 203; i++) {
      state.event.items.push(
        eventRecordFactory({
          node_id: 1,
          created: "Tue, 16 Mar. 2021 03:04:00",
        })
      );
    }
    const store = mockStore(state);
    let wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='page-size']").simulate("change", {
      target: {
        name: "page-size",
        value: "100",
      },
    });
    // Render another log, this one should get the updated page size.
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("EventLogsTable").prop("events").length).toBe(100);
  });

  it("does not display the scroll-to-top component if there are less than 50 items", async () => {
    state.event.items = [];
    for (let i = 0; i < 5; i++) {
      state.event.items.push(
        eventRecordFactory({
          node_id: 1,
          created: "Tue, 16 Mar. 2021 03:04:00",
        })
      );
    }
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='page-size']").simulate("change", {
      target: {
        name: "page-size",
        value: "50",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("[data-test='backToTop']").exists()).toBe(false);
  });

  it("displays the scroll-to-top component if there are at least 50 items", async () => {
    state.event.items = [];
    for (let i = 0; i < 50; i++) {
      state.event.items.push(
        eventRecordFactory({
          node_id: 1,
          created: "Tue, 16 Mar. 2021 03:04:00",
        })
      );
    }
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='page-size']").simulate("change", {
      target: {
        name: "page-size",
        value: "50",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("[data-test='backToTop']").exists()).toBe(true);
  });

  it("scrolls to the top when clicking the scroll-to-top component", async () => {
    state.event.items = [];
    for (let i = 0; i < 50; i++) {
      state.event.items.push(
        eventRecordFactory({
          node_id: 1,
          created: "Tue, 16 Mar. 2021 03:04:00",
        })
      );
    }
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='page-size']").simulate("change", {
      target: {
        name: "page-size",
        value: "50",
      },
    });
    await waitForComponentToPaint(wrapper);
    wrapper.find("a[data-test='backToTop']").simulate("click");
    expect(scrollToSpy).toHaveBeenCalled();
  });
});
