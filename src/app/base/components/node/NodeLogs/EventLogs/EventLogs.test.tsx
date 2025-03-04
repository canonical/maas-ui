import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import type { Mock } from "vitest";

import EventLogs, { Label } from "./EventLogs";

import { Labels as ArrowPaginationLabels } from "@/app/base/components/ArrowPagination";
import { MAIN_CONTENT_SECTION_ID } from "@/app/base/components/MainContentSection";
import type { MachineDetails } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  render,
  screen,
  within,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("EventLogs", () => {
  let state: RootState;
  let scrollToSpy: Mock;
  let machine: MachineDetails;

  beforeEach(() => {
    scrollToSpy = vi.fn();
    global.scrollTo = scrollToSpy;
    machine = factory.machineDetails({ id: 1, system_id: "abc123" });
    state = factory.rootState({
      event: factory.eventState({
        items: [
          factory.eventRecord({ node_id: 1 }),
          factory.eventRecord({ node_id: 2 }),
        ],
      }),
      machine: factory.machineState({
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
        factory.eventRecord({
          node_id: 1,
          created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
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
        factory.eventRecord({
          node_id: 1,
          created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
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
    for (let i = 0; i < 8; i++) {
      await userEvent.click(
        screen.getByRole("button", { name: ArrowPaginationLabels.GoForward })
      );
    }
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
      factory.eventRecord({
        created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
        node_id: 1,
      }),
      factory.eventRecord({
        created: factory.timestamp("Tue, 17 Mar. 2021 03:04:00"),
        node_id: 1,
      }),
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
      factory.eventRecord({
        description: "Failed commissioning",
        node_id: 1,
        type: factory.eventType({ description: undefined }),
      }),
      factory.eventRecord({
        description: "Didn't fail",
        node_id: 1,
        type: factory.eventType({ description: undefined }),
      }),
      factory.eventRecord({
        description: "Failed install",
        node_id: 1,
        type: factory.eventType({ description: undefined }),
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
        factory.eventRecord({
          node_id: 1,
          created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
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
        factory.eventRecord({
          node_id: 1,
          created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
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
        factory.eventRecord({
          node_id: 1,
          created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
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
        factory.eventRecord({
          node_id: 1,
          created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
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
        factory.eventRecord({
          node_id: 1,
          created: factory.timestamp("Tue, 16 Mar. 2021 03:04:00"),
        })
      );
    }
    renderWithBrowserRouter(<EventLogs node={machine} />, {
      state,
    });
    await userEvent.selectOptions(screen.getByRole("combobox"), "50");
    expect(window.location.hash).toBe("");
    await userEvent.click(screen.getByRole("link", { name: Label.BackToTop }));
    expect(window.location.hash).toBe(`#${MAIN_CONTENT_SECTION_ID}`);
  });
});
