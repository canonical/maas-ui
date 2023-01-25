import { NotificationSeverity } from "@canonical/react-components";
import reduxToolkit from "@reduxjs/toolkit";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DeleteTagForm from "./DeleteTagForm";

import * as baseHooks from "app/base/hooks/base";
import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { NodeStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStateCount as machineStateCountFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { userEvent, render, screen, waitFor } from "testing/utils";

const mockStore = configureStore();

let state: RootState;
let scrollToSpy: jest.Mock;

beforeEach(() => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
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
        <CompatRouter>
          <DeleteTagForm id={1} onClose={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(screen.getByRole("button", { name: "Delete" }));
  const expected = tagActions.delete(1);
  await waitFor(() =>
    expect(
      store.getActions().find((action) => action.type === expected.type)
    ).toStrictEqual(expected)
  );
});

it("dispatches an action to add a notification when tag successfully deleted", async () => {
  const useAddMessageMock = jest.spyOn(baseHooks, "useAddMessage");
  state.tag.saved = true;
  state.tag.errors = null;
  state.tag.items[0].name = "tagalog";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <DeleteTagForm id={1} onClose={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const mockArgs = useAddMessageMock.mock.calls[0];
  expect(mockArgs[2]).toBe("Deleted tagalog from tag list.");
  expect(mockArgs[4]).toBe(NotificationSeverity.POSITIVE);
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
        <CompatRouter>
          <DeleteTagForm id={1} onClose={jest.fn()} />
        </CompatRouter>
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
        <CompatRouter>
          <DeleteTagForm id={1} onClose={jest.fn()} />
        </CompatRouter>
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
  const path = urls.tags.tag.machines({ id: 1 });
  const history = createMemoryHistory({
    initialEntries: [{ pathname: path }],
  });
  const onClose = jest.fn();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Route
            component={() => <DeleteTagForm id={1} onClose={onClose} />}
            exact
            path={path}
          />
        </CompatRouter>
      </Router>
    </Provider>
  );
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(history.location.pathname).toBe(urls.tags.index);
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
  state.machine.counts = {
    "mocked-nanoid": machineStateCountFactory({
      count: 1,
      loaded: true,
    }),
  };
  const path = urls.tags.tag.machines({ id: 1 });
  const history = createMemoryHistory({
    initialEntries: [{ pathname: path }],
  });
  const onClose = jest.fn();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Route
            component={() => (
              <DeleteTagForm fromDetails id={1} onClose={onClose} />
            )}
            exact
            path={path}
          />
        </CompatRouter>
      </Router>
    </Provider>
  );
  await userEvent.click(
    screen.getByRole("link", { name: "Show the deployed machine" })
  );
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(history.location.pathname).toBe(urls.tags.tag.index({ id: 1 }));
  expect(onClose).toBeCalled();
});
