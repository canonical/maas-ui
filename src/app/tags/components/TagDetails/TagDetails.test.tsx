import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagDetails from "./TagDetails";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    tag: factory.tagState({
      items: [
        factory.tag({
          id: 1,
          name: "rad",
        }),
        factory.tag({
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
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <TagDetails id={1} />}
            exact
            path={urls.tags.tag.index(null)}
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
  const state = factory.rootState({
    tag: factory.tagState({
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
          <Route
            component={() => <TagDetails id={1} />}
            exact
            path={urls.tags.tag.index(null)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Tag not found")).toBeInTheDocument();
});

it("shows a spinner if the tag has not loaded yet", () => {
  const state = factory.rootState({
    tag: factory.tagState({
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
          <Route
            component={() => <TagDetails id={1} />}
            exact
            path={urls.tags.tag.index(null)}
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
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <TagDetails id={1} />}
            exact
            path={urls.tags.tag.index(null)}
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
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <TagDetails id={1} narrow />}
            exact
            path={urls.tags.tag.index(null)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.queryByText("rad")).not.toBeInTheDocument();
});
