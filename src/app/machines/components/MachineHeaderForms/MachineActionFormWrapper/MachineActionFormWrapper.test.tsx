import reduxToolkit from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineActionFormWrapper from "./MachineActionFormWrapper";

import { actions as machineActions } from "app/store/machine";
import { NodeActions } from "app/store/types/node";
import {
  machineActionState as machineActionStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

let html: HTMLHtmlElement | null;
const originalScrollTo = global.scrollTo;

beforeEach(() => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
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
    <MachineActionFormWrapper
      action={NodeActions.ABORT}
      clearHeaderContent={jest.fn()}
      selectedMachines={{}}
      viewingDetails={false}
    />
  );
  expect(global.scrollTo).toHaveBeenCalled();
});

it("can show untag errors when the tag form is open", async () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      actions: {
        "123456": machineActionStateFactory({
          status: "error",
          errors: "Untagging failed",
        }),
      },
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
          <MachineActionFormWrapper
            action={NodeActions.TAG}
            clearHeaderContent={jest.fn()}
            selectedMachines={{ items: [machines[0].system_id] }}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Untagging failed")).toBeInTheDocument();
});

it("clears selected machines and invalidates queries on delete success", async () => {
  mockFormikFormSaved();
  const state = rootStateFactory();
  const machines = [
    machineFactory({
      system_id: "abc123",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <MachineActionFormWrapper
            action={NodeActions.DELETE}
            clearHeaderContent={jest.fn()}
            selectedMachines={{ items: [machines[0].system_id] }}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    store
      .getActions()
      .find((action) => action.type === "machine/setSelectedMachines").payload
  ).toEqual(null);
  expect(
    store
      .getActions()
      .filter(
        (action) => action.type === machineActions.invalidateQueries().type
      )
  ).toHaveLength(1);
});

it("displays a warning message and disabled submit button when selectedCount equals 0", () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <MachineActionFormWrapper
            action={NodeActions.DELETE}
            clearHeaderContent={jest.fn()}
            selectedCount={0}
            selectedMachines={{ filter: {} }}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/No machines have been selected./)
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Delete machine" })).toBeDisabled();
});
