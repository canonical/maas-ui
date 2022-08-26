import reduxToolkit from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import TagMachines, { Label } from "./TagMachines";

import urls from "app/base/urls";
import { columnLabels, MachineColumns } from "app/machines/constants";
import { actions as machineActions } from "app/store/machine";
import { FetchGroupKey, FetchSortDirection } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { NodeStatus, FetchNodeStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
  const machines = [
    machineFactory({
      domain: modelRefFactory({ id: 1, name: "test" }),
      hostname: "deployed",
      status: NodeStatus.DEPLOYED,
      tags: [1],
    }),
  ];
  state = rootStateFactory({
    machine: machineStateFactory({
      items: machines,
      lists: {
        "mocked-nanoid": machineStateListFactory({
          loaded: true,
          groups: [
            machineStateListGroupFactory({
              items: machines.map(({ system_id }) => system_id),
              name: "Deployed",
            }),
          ],
        }),
      },
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

afterEach(() => {
  jest.restoreAllMocks();
});

it("dispatches actions to fetch necessary data", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route element={<TagMachines />} path={urls.tags.tag.index(null)} />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const expectedActions = [
    machineActions.fetch("mocked-nanoid", {
      filter: {
        status: FetchNodeStatus.DEPLOYED,
        tags: ["rad"],
      },
      group_key: null,
      page_number: 1,
      page_size: 50,
      sort_direction: FetchSortDirection.Descending,
      sort_key: FetchGroupKey.Hostname,
    }),
    tagActions.fetch(),
  ];
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
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route element={<TagMachines />} path={urls.tags.tag.index(null)} />
          </Routes>
        </CompatRouter>
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
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route element={<TagMachines />} path={urls.tags.tag.index(null)} />
          </Routes>
        </CompatRouter>
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
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route element={<TagMachines />} path={urls.tags.tag.index(null)} />
          </Routes>
        </CompatRouter>
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
