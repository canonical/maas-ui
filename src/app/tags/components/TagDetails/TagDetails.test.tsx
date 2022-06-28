import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
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
          id: 1,
          name: "rad",
        }),
        tagFactory({
          id: 2,
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
        <CompatRouter>
          <Route
            component={() => <TagDetails id={1} />}
            exact
            path={tagURLs.tag.index(null)}
          />
        </CompatRouter>
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
        <CompatRouter>
          <Route
            component={() => <TagDetails id={1} />}
            exact
            path={tagURLs.tag.index(null)}
          />
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
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <TagDetails id={1} />}
            exact
            path={tagURLs.tag.index(null)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("displays the tag name when not narrow", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <TagDetails id={1} />}
            exact
            path={tagURLs.tag.index(null)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText("rad")).toBeInTheDocument();
});

it("does not display the tag name when narrow", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <TagDetails id={1} narrow />}
            exact
            path={tagURLs.tag.index(null)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.queryByText("rad")).not.toBeInTheDocument();
});
