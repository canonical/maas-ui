import { render } from "@testing-library/react";

import TestHistory from "./TestHistory";

import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  partialScriptResult as partialScriptResultFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("TestHistory", () => {
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
      }),
    });
  });

  it("fetches script result history on load", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    state.scriptresult.items = [scriptResult];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={jest.fn()} scriptResult={scriptResult} />,
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
    const scriptResult = scriptResultFactory({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.scriptresult.history = {};
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={jest.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays a test history table if test has been run more than once", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.scriptresult.history = {
      1: [partialScriptResultFactory(), partialScriptResultFactory()],
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={jest.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );

    expect(screen.getByTestId("history-table")).toBeInTheDocument();
  });

  it("displays a link to the history details", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.scriptresult.history = {
      1: [partialScriptResultFactory(), partialScriptResultFactory()],
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={jest.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );

    expect(screen.getByTestId("details-link")).toBeInTheDocument();
  });

  it("displays a message if the test has no history", () => {
    const scriptResult = scriptResultFactory({ id: 1 });
    state.scriptresult.items = [scriptResult];
    state.scriptresult.history = {
      1: [partialScriptResultFactory()],
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <TestHistory close={jest.fn()} scriptResult={scriptResult} />,
      { route: "/machine/abc123", store }
    );

    expect(screen.getByTestId("no-history")).toBeInTheDocument();
  });
});
