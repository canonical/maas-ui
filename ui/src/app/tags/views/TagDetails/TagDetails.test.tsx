import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagDetails from "./TagDetails";

import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagURLs from "app/tags/urls";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [
        tagFactory({
          name: "rad",
        }),
        tagFactory({
          name: "cool",
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
          component={() => <TagDetails onDelete={jest.fn()} />}
        />
      </MemoryRouter>
    </Provider>
  );

  const expectedActions = [tagActions.fetch()];
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
          component={() => <TagDetails onDelete={jest.fn()} />}
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
          component={() => <TagDetails onDelete={jest.fn()} />}
        />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});
