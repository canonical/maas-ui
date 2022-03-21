import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteTagForm from "./DeleteTagForm";

import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import {
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [tagFactory({ id: 1 })],
    }),
  });
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
