import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ActionFormWrapper from "./ActionFormWrapper";

import { NodeActions } from "app/store/types/node";
import {
  machineEventError as machineEventErrorFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

let html: HTMLHtmlElement | null;
const originalScrollTo = global.scrollTo;

beforeEach(() => {
  global.innerHeight = 500;
  // eslint-disable-next-line testing-library/no-node-access
  html = document.querySelector("html");
  global.scrollTo = jest.fn();
});

afterEach(() => {
  if (html) {
    html.scrollTop = 0;
  }
  jest.restoreAllMocks();
});

afterAll(() => {
  global.scrollTo = originalScrollTo;
});

it("scrolls to the top of the window when opening the form", async () => {
  if (html) {
    // Move the page down so that the hook will fire.
    html.scrollTop = 10;
  }
  renderWithBrowserRouter(
    <ActionFormWrapper
      action={NodeActions.ABORT}
      clearHeaderContent={jest.fn()}
      machines={[]}
      viewingDetails={false}
    />
  );
  expect(global.scrollTo).toHaveBeenCalled();
});

it("can show untag errors when the tag form is open", async () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      eventErrors: [
        machineEventErrorFactory({
          id: "abc123",
          error: "Untagging failed",
          event: NodeActions.UNTAG,
        }),
      ],
    }),
    tag: tagStateFactory({
      loaded: true,
    }),
  });
  const machines = [
    machineFactory({
      system_id: "abc123",
      actions: [NodeActions.TAG, NodeActions.UNTAG],
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <ActionFormWrapper
            action={NodeActions.TAG}
            clearHeaderContent={jest.fn()}
            machines={machines}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Untagging failed")).toBeInTheDocument();
});
