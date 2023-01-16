import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Label } from "../TagUpdate/TagUpdate";

import TagDetails from "./TagDetails";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { TagViewState } from "app/tags/types";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

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
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<TagDetails onDelete={jest.fn()} />}
              path={urls.tags.tag.index(null)}
            />
          </Routes>
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
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<TagDetails onDelete={jest.fn()} />}
              path={urls.tags.tag.index(null)}
            />
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
            <Route
              element={<TagDetails onDelete={jest.fn()} />}
              path={urls.tags.tag.index(null)}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("can display the edit form", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.tags.tag.update({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={
                <TagDetails
                  onDelete={jest.fn()}
                  tagViewState={TagViewState.Updating}
                />
              }
              path={urls.tags.tag.update(null)}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByRole("form", { name: Label.Form })).toBeInTheDocument();
});

it("can go to the tag edit page", async () => {
  const path = urls.tags.tag.index({ id: 1 });
  const history = createMemoryHistory({
    initialEntries: [{ pathname: path }],
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Routes>
            <Route
              element={<TagDetails onDelete={jest.fn()} />}
              path={urls.tags.tag.index(null)}
            />
          </Routes>
        </CompatRouter>
      </Router>
    </Provider>
  );
  await userEvent.click(screen.getByRole("link", { name: "Edit" }));
  expect(history.location.pathname).toBe(urls.tags.tag.update({ id: 1 }));
  expect(history.location.state).toStrictEqual({ canGoBack: true });
});
