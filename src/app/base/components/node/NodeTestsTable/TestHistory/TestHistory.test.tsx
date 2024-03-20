import configureStore from "redux-mock-store";

import TestHistory from "./TestHistory";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("TestHistory", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machineDetails({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
      scriptresult: factory.scriptResultState({
        loaded: true,
      }),
    });
  });

  it("fetches script result history on load", () => {
    const scriptResult = factory.scriptResult({ id: 1 });
    state.scriptresult.items = [scriptResult];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={vi.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );
    const actions = store.getActions();

    expect(
      actions.find((action) => action.type === "scriptresult/getHistory")
    ).toStrictEqual({
      meta: {
        method: "get_history",
        model: "noderesult",
        nocache: true,
      },
      payload: {
        params: {
          id: 1,
        },
      },
      type: "scriptresult/getHistory",
    });
  });

  it("shows a spinner if history hasn't loaded in yet", () => {
    const scriptResult = factory.scriptResult({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.scriptresult.history = {};
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={vi.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays a test history table if test has been run more than once", () => {
    const scriptResult = factory.scriptResult({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.scriptresult.history = {
      1: [factory.partialScriptResult(), factory.partialScriptResult()],
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={vi.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );

    expect(screen.getByTestId("history-table")).toBeInTheDocument();
  });

  it("displays a link to the history details", () => {
    const scriptResult = factory.scriptResult({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.scriptresult.history = {
      1: [factory.partialScriptResult(), factory.partialScriptResult()],
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={vi.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );

    expect(screen.getAllByTestId("details-link")).toHaveLength(2);
  });

  it("displays a message if the test has no history", () => {
    const scriptResult = factory.scriptResult({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.scriptresult.history = {
      1: [factory.partialScriptResult()],
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={vi.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );

    expect(screen.getByTestId("no-history")).toBeInTheDocument();
  });
});
