import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Router } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteTagForm from "./DeleteTagForm";

import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { NodeStatus } from "app/store/types/node";
import tagsURLs from "app/tags/urls";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;
let scrollToSpy: jest.Mock;

beforeEach(() => {
  state = rootStateFactory({
    machine: machineStateFactory({
      items: [
        machineFactory({
          status: NodeStatus.DEPLOYED,
          tags: [1],
        }),
      ],
    }),
    tag: tagStateFactory({
      items: [tagFactory({ id: 1 })],
    }),
  });
  // Mock the scrollTo method as jsdom doesn't support this and will error.
  scrollToSpy = jest.fn();
  global.scrollTo = scrollToSpy;
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("dispatches an action to delete a tag", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <DeleteTagForm id={1} onClose={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );
  fireEvent.submit(screen.getByRole("form"));
  const expected = tagActions.delete(1);
  await waitFor(() =>
    expect(
      store.getActions().find((action) => action.type === expected.type)
    ).toStrictEqual(expected)
  );
});

it("displays a message when deleting a tag on a machine", async () => {
  state.tag.items = [
    tagFactory({
      id: 1,
      machine_count: 4,
      name: "tag1",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <DeleteTagForm id={1} onClose={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("heading", {
      name: "tag1 will be deleted and unassigned from every tagged machine. Are you sure?",
    })
  ).toBeInTheDocument();
});

it("displays a message when deleting a tag not on a machine", async () => {
  state.tag.items = [
    tagFactory({
      id: 1,
      machine_count: 0,
      name: "tag1",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <DeleteTagForm id={1} onClose={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("heading", {
      name: "tag1 will be deleted. Are you sure?",
    })
  ).toBeInTheDocument();
});

it("can return to the list on cancel", async () => {
  state.tag.items = [
    tagFactory({
      id: 1,
      kernel_opts: "opts",
      machine_count: 1,
      name: "tag1",
    }),
  ];
  const path = tagsURLs.tag.machines({ id: 1 });
  const history = createMemoryHistory({
    initialEntries: [{ pathname: path }],
  });
  const onClose = jest.fn();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <Route
          exact
          path={path}
          component={() => <DeleteTagForm id={1} onClose={onClose} />}
        />
      </Router>
    </Provider>
  );
  userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(history.location.pathname).toBe(tagsURLs.tags.index);
  expect(onClose).toBeCalled();
});

it("can return to the details on cancel", async () => {
  state.tag.items = [
    tagFactory({
      id: 1,
      kernel_opts: "opts",
      machine_count: 1,
      name: "tag1",
    }),
  ];
  const path = tagsURLs.tag.machines({ id: 1 });
  const history = createMemoryHistory({
    initialEntries: [{ pathname: path }],
  });
  const onClose = jest.fn();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <Route
          exact
          path={path}
          component={() => (
            <DeleteTagForm fromDetails id={1} onClose={onClose} />
          )}
        />
      </Router>
    </Provider>
  );
  userEvent.click(
    screen.getByRole("link", { name: "Show the deployed machine" })
  );
  userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(history.location.pathname).toBe(tagsURLs.tag.index({ id: 1 }));
  expect(onClose).toBeCalled();
});
