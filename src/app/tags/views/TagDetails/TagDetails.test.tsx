import { Route, Routes } from "react-router-dom-v5-compat";
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
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();
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
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={<TagDetails onDelete={jest.fn()} />}
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    { route: urls.tags.tag.index({ id: 1 }), store }
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
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={<TagDetails onDelete={jest.fn()} />}
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    { route: urls.tags.tag.index({ id: 1 }), state }
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
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={<TagDetails onDelete={jest.fn()} />}
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    { route: urls.tags.tag.index({ id: 1 }), state }
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("can display the edit form", () => {
  renderWithBrowserRouter(
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
    </Routes>,
    { route: urls.tags.tag.update({ id: 1 }), state }
  );
  expect(screen.getByRole("form", { name: Label.Form })).toBeInTheDocument();
});

it("can go to the tag edit page", async () => {
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={<TagDetails onDelete={jest.fn()} />}
        path={urls.tags.tag.index(null)}
      />
    </Routes>,
    { route: urls.tags.tag.index({ id: 1 }), state }
  );
  await userEvent.click(screen.getByRole("link", { name: "Edit" }));
  expect(window.location.pathname).toBe(urls.tags.tag.update({ id: 1 }));
});
