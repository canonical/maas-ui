import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagMachines, { Label } from "./TagMachines";

import { columnLabels, MachineColumns } from "app/machines/constants";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { NodeStatus } from "app/store/types/node";
import tagURLs from "app/tags/urls";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    machine: machineStateFactory({
      items: [
        machineFactory({
          domain: modelRefFactory({ id: 1, name: "test" }),
          hostname: "deployed",
          status: NodeStatus.DEPLOYED,
          tags: [1],
        }),
      ],
    }),
    tag: tagStateFactory({
      items: [
        tagFactory({
          id: 1,
          machine_count: 1,
          name: "rad",
        }),
      ],
    }),
  });
});

it("dispatches actions to fetch necessary data", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={tagURLs.tag.index(null, true)}
          component={() => <TagMachines />}
        />
      </MemoryRouter>
    </Provider>
  );
  const expectedActions = [machineActions.fetch(), tagActions.fetch()];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("displays a message if the tag does not exist", () => {
  const state = rootStateFactory({
    tag: tagStateFactory({
      items: [],
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={tagURLs.tag.index(null, true)}
          component={() => <TagMachines />}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText("Tag not found")).toBeInTheDocument();
});

it("shows a spinner if the tag has not loaded yet", () => {
  const state = rootStateFactory({
    tag: tagStateFactory({
      items: [],
      loading: true,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={tagURLs.tag.index(null, true)}
          component={() => <TagMachines />}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("displays the machine list", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={tagURLs.tag.index(null, true)}
          component={() => <TagMachines />}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("grid", { name: Label.Machines })
  ).toBeInTheDocument();
  const rows = screen.getAllByRole("gridcell", {
    name: columnLabels[MachineColumns.FQDN],
  });
  expect(rows).toHaveLength(1);
  expect(rows[0].textContent?.includes("deployed.test")).toBe(true);
});
