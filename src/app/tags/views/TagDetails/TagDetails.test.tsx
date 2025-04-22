import { Route, Routes } from "react-router";
import configureStore from "redux-mock-store";

import TagDetails from "./TagDetails";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();
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
  renderWithBrowserRouter(
    <Routes>
      <Route element={<TagDetails />} path={urls.tags.tag.index(null)} />
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
  const state = factory.rootState({
    tag: factory.tagState({
      items: [],
      loading: false,
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route element={<TagDetails />} path={urls.tags.tag.index(null)} />
    </Routes>,
    { route: urls.tags.tag.index({ id: 1 }), state }
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
  renderWithBrowserRouter(
    <Routes>
      <Route element={<TagDetails />} path={urls.tags.tag.index(null)} />
    </Routes>,
    { route: urls.tags.tag.index({ id: 1 }), state }
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});
