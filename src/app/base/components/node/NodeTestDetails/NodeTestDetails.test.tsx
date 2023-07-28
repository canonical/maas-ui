import configureStore from "redux-mock-store";

import NodeTestDetails from "./NodeTestDetails";

import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, within } from "testing/utils";

const mockStore = configureStore<RootState>();
const getReturnPath = (id: string) => `/some/url/${id}`;

describe("NodeTestDetails", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
        items: [scriptResultFactory()],
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.scriptresult.loading = true;
    renderWithBrowserRouter(<NodeTestDetails getReturnPath={getReturnPath} />, {
      route: "/machine/abc123/testing/1/details",
      routePattern: "/machine/:id/testing/:scriptResultId/details",
      state,
    });
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays a message if script results aren't found", () => {
    state.scriptresult.items = [];
    renderWithBrowserRouter(<NodeTestDetails getReturnPath={getReturnPath} />, {
      route: "/machine/abc123/testing/1/details",
      routePattern: "/machine/:id/testing/:scriptResultId/details",
      state,
    });
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });

  it("fetches script results", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    const scriptResults = [scriptResult];
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    renderWithBrowserRouter(<NodeTestDetails getReturnPath={getReturnPath} />, {
      route: "/machine/abc123/testing/1/details",
      routePattern: "/machine/:id/testing/:scriptResultId/details",
      store,
    });
    expect(
      store.getActions().find((action) => action.type === "scriptresult/get")
    ).toStrictEqual({
      meta: {
        method: "get",
        model: "noderesult",
      },
      payload: {
        params: {
          id: 1,
        },
      },
      type: "scriptresult/get",
    });
  });

  it("only fetches script results once", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    const scriptResults = [scriptResult];
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;
    const store = mockStore(state);
    const { rerender } = renderWithBrowserRouter(
      <NodeTestDetails getReturnPath={getReturnPath} />,
      {
        route: "/machine/abc123/testing/1/details",
        routePattern: "/machine/:id/testing/:scriptResultId/details",
        store,
      }
    );
    expect(
      store.getActions().filter((action) => action.type === "scriptresult/get")
        .length
    ).toBe(1);
    rerender(<NodeTestDetails getReturnPath={getReturnPath} />);
    expect(
      store.getActions().filter((action) => action.type === "scriptresult/get")
        .length
    ).toBe(1);
  });

  it("displays script result details", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    const scriptResults = [scriptResult];
    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;

    renderWithBrowserRouter(<NodeTestDetails getReturnPath={getReturnPath} />, {
      route: "/machine/abc123/testing/1/details",
      routePattern: "/machine/:id/testing/:scriptResultId/details",
      state,
    });

    expect(screen.getByText(scriptResult.status_name)).toBeInTheDocument();
    expect(screen.getByText(scriptResult.status_name).firstChild).toHaveClass(
      "p-icon--success"
    );
  });

  it("displays script result metrics", () => {
    const metrics = scriptResultResultFactory({
      title: "test-title",
      value: "test-value",
    });
    const scriptResults = [scriptResultFactory({ id: 1, results: [metrics] })];

    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;

    renderWithBrowserRouter(<NodeTestDetails getReturnPath={getReturnPath} />, {
      route: "/machine/abc123/testing/1/details",
      routePattern: "/machine/:id/testing/:scriptResultId/details",
      state,
    });

    const metricsTable = screen.getByTestId("script-details-metrics");
    expect(metricsTable).toBeInTheDocument();
    expect(
      within(within(metricsTable).getAllByRole("row")[0]).getAllByRole(
        "gridcell"
      )[0]
    ).toHaveTextContent("test-title");
    expect(
      within(within(metricsTable).getAllByRole("row")[0]).getAllByRole(
        "gridcell"
      )[1]
    ).toHaveTextContent("test-value");
  });

  it("fetches script result logs", () => {
    const scriptResults = [scriptResultFactory({ id: 1 })];

    state.nodescriptresult.items = { abc123: [1] };
    state.scriptresult.items = scriptResults;

    const store = mockStore(state);

    renderWithBrowserRouter(<NodeTestDetails getReturnPath={getReturnPath} />, {
      route: "/machine/abc123/testing/1/details",
      routePattern: "/machine/:id/testing/:scriptResultId/details",
      store,
    });
    const actions = store
      .getActions()
      .filter((action) => action.type === "scriptresult/getLogs");
    expect(actions[0].payload.params.data_type).toEqual("combined");
    expect(actions[1].payload.params.data_type).toEqual("stdout");
    expect(actions[2].payload.params.data_type).toEqual("stderr");
    expect(actions[3].payload.params.data_type).toEqual("result");
  });

  it("renders a return link", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.nodescriptresult.items = { abc123: [scriptResult.id] };

    renderWithBrowserRouter(<NodeTestDetails getReturnPath={getReturnPath} />, {
      route: "/machine/abc123/testing/1/details",
      routePattern: "/machine/:id/testing/:scriptResultId/details",
      state,
    });

    expect(
      screen.getByRole("link", { name: "‹ Back to test results" })
    ).toHaveAttribute("href", getReturnPath("abc123"));
  });
});
