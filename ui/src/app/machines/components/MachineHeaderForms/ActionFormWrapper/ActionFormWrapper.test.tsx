import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ActionFormWrapper from "./ActionFormWrapper";

import { actions as machineActions } from "app/store/machine";
import { NodeActions } from "app/store/types/node";
import {
  machineEventError as machineEventErrorFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("can set selected machines to those that can perform action", async () => {
  const state = rootStateFactory();
  const machines = [
    machineFactory({ system_id: "abc123", actions: [NodeActions.ABORT] }),
    machineFactory({ system_id: "def456", actions: [] }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <ActionFormWrapper
          action={NodeActions.ABORT}
          clearHeaderContent={jest.fn()}
          machines={machines}
          viewingDetails={false}
        />
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(
    screen.getByRole("button", { name: /update your selection/ })
  );

  const expectedAction = machineActions.setSelected(["abc123"]);
  const actualActions = store.getActions();
  expect(
    actualActions.find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
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
        <ActionFormWrapper
          action={NodeActions.TAG}
          clearHeaderContent={jest.fn()}
          machines={machines}
          viewingDetails={false}
        />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Untagging failed")).toBeInTheDocument();
});
