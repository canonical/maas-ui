import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EventLogs, { Label } from "./EventLogs";

import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  eventRecord as eventRecordFactory,
  eventType as eventTypeFactory,
  eventState as eventStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore();

describe("EventLogs", () => {
  let state: RootState;
  let scrollToSpy: jest.Mock;
  let machine: MachineDetails;

  beforeEach(() => {
    scrollToSpy = jest.fn();
    global.scrollTo = scrollToSpy;
    machine = machineDetailsFactory({ id: 1, system_id: "abc123" });
    state = rootStateFactory({
      event: eventStateFactory({
        items: [
          eventRecordFactory({ node_id: 1 }),
          eventRecordFactory({ node_id: 2 }),
        ],
      }),
      machine: machineStateFactory({
        items: [machine],
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("can display the table", () => {
    renderWithMockStore(<EventLogs node={machine} />, {
      state,
    });
    expect(screen.getByLabelText(Label.Title)).toBeInTheDocument();
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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs node={machine} />
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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs node={machine} />
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

  it("fetches more events when the last page is reached", async () => {
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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs node={machine} />
        </MemoryRouter>
      </Provider>
    );
    let dispatches = store
      .getActions()
      .filter(({ type }) => type === "event/fetch");
    expect(dispatches.length).toBe(1);
    // Navigate to the last page:
    await userEvent.click(screen.getByRole("button", { name: "Page 2" }));
    await userEvent.click(screen.getByRole("button", { name: "Page 3" }));
    await userEvent.click(screen.getByRole("button", { name: "Page 4" }));
    await userEvent.click(screen.getByRole("button", { name: "Page 5" }));
    await userEvent.click(screen.getByRole("button", { name: "Page 6" }));
    await userEvent.click(screen.getByRole("button", { name: "Page 7" }));
    await userEvent.click(screen.getByRole("button", { name: "Page 8" }));
    await userEvent.click(screen.getByRole("button", { name: "Page 9" }));
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
    renderWithMockStore(<EventLogs node={machine} />, {
      state,
    });
    const rows = screen.getAllByRole("row");
    expect(
      within(rows[1]).getByRole("gridcell", {
        name: "Tue, 17 Mar. 2021 03:04:00",
      })
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("gridcell", {
        name: "Tue, 16 Mar. 2021 03:04:00",
      })
    ).toBeInTheDocument();
  });

  it("can filter the events", async () => {
    state.event.items = [
      eventRecordFactory({
        description: "Failed commissioning",
        node_id: 1,
        type: eventTypeFactory({ description: undefined }),
      }),
      eventRecordFactory({
        description: "Didn't fail",
        node_id: 1,
        type: eventTypeFactory({ description: undefined }),
      }),
      eventRecordFactory({
        description: "Failed install",
        node_id: 1,
        type: eventTypeFactory({ description: undefined }),
      }),
    ];
    renderWithMockStore(<EventLogs node={machine} />, {
      state,
    });
    await userEvent.type(screen.getByRole("searchbox"), "failed");
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(
      within(rows[1]).getByRole("gridcell", {
        name: "Failed commissioning",
      })
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("gridcell", {
        name: "Failed install",
      })
    ).toBeInTheDocument();
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
    renderWithMockStore(<EventLogs node={machine} />, {
      state,
    });
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(26);
    await userEvent.selectOptions(screen.getByRole("combobox"), "50");
    expect(screen.getAllByRole("row")).toHaveLength(51);
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
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs node={machine} />
        </MemoryRouter>
      </Provider>
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "100");
    // Render another log, this one should get the updated page size.
    rerender(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EventLogs node={machine} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getAllByRole("row")).toHaveLength(101);
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
    renderWithMockStore(<EventLogs node={machine} />, {
      state,
    });
    await userEvent.selectOptions(screen.getByRole("combobox"), "50");
    expect(
      screen.queryByRole("link", { name: Label.BackToTop })
    ).not.toBeInTheDocument();
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
    renderWithMockStore(<EventLogs node={machine} />, {
      state,
    });
    await userEvent.selectOptions(screen.getByRole("combobox"), "50");
    expect(
      screen.getByRole("link", { name: Label.BackToTop })
    ).toBeInTheDocument();
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
    renderWithMockStore(<EventLogs node={machine} />, {
      state,
    });
    await userEvent.selectOptions(screen.getByRole("combobox"), "50");
    await userEvent.click(screen.getByRole("link", { name: Label.BackToTop }));
    expect(scrollToSpy).toHaveBeenCalled();
  });
});
