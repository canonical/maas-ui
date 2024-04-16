import { Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";

import SpaceDetails from "./SpaceDetails";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { spaceActions } from "@/app/store/space";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  waitFor,
  within,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

it("dispatches actions to get and set space as active on mount", () => {
  const state = factory.rootState();
  const store = mockStore(state);
  renderWithBrowserRouter(
    <Routes>
      <Route element={<SpaceDetails />} path={urls.subnets.space.index(null)} />
    </Routes>,
    { route: urls.subnets.space.index({ id: 1 }), store }
  );

  const expectedActions = [spaceActions.get(1), spaceActions.setActive(1)];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("dispatches actions to unset active space and clean up on unmount", () => {
  const state = factory.rootState();
  const store = mockStore(state);
  const { unmount } = renderWithBrowserRouter(
    <Routes>
      <Route element={<SpaceDetails />} path={urls.subnets.space.index(null)} />
    </Routes>,
    { route: urls.subnets.space.index({ id: 1 }), store }
  );

  unmount();

  const expectedActions = [
    spaceActions.setActive(null),
    spaceActions.cleanup(),
  ];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) =>
          actualAction.type === expectedAction.type &&
          // Check payload to differentiate "set" and "unset" active actions
          actualAction.payload?.params === expectedAction.payload?.params
      )
    ).toStrictEqual(expectedAction);
  });
});

it("displays a message if the space does not exist", () => {
  const state = factory.rootState({
    space: factory.spaceState({
      items: [],
      loading: false,
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route element={<SpaceDetails />} path={urls.subnets.space.index(null)} />
    </Routes>,
    { route: urls.subnets.space.index({ id: 1 }), state }
  );

  expect(screen.getByText("Space not found")).toBeInTheDocument();
});

it("shows a spinner if the space has not loaded yet", () => {
  const state = factory.rootState({
    space: factory.spaceState({
      items: [],
      loading: true,
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route element={<SpaceDetails />} path={urls.subnets.space.index(null)} />
    </Routes>,
    { route: urls.subnets.space.index({ id: 1 }), state }
  );

  expect(
    screen.getByTestId("section-header-title-spinner")
  ).toBeInTheDocument();
});

it("displays space details", async () => {
  const space = factory.space({
    id: 1,
    name: "space1",
    description: "space 1 description",
  });
  const state = factory.rootState({
    space: factory.spaceState({
      items: [space],
      loading: false,
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route element={<SpaceDetails />} path={urls.subnets.space.index(null)} />
    </Routes>,
    { route: urls.subnets.space.index({ id: 1 }), state }
  );

  const spaceSummary = await screen.findByRole("region", {
    name: "Space summary",
  });
  expect(within(spaceSummary).getByText(space.name)).toBeInTheDocument();
  expect(within(spaceSummary).getByText(space.description)).toBeInTheDocument();
});

it("displays a delete confirmation before delete", async () => {
  const space = factory.space({
    id: 1,
    name: "space1",
    description: "space 1 description",
  });
  const state = factory.rootState({
    space: factory.spaceState({
      items: [space],
      loading: false,
    }),
  });
  const store = mockStore(state);
  renderWithBrowserRouter(
    <Routes>
      <Route element={<SpaceDetails />} path={urls.subnets.space.index(null)} />
    </Routes>,
    { route: urls.subnets.space.index({ id: 1 }), store }
  );
  await userEvent.click(screen.getByRole("button", { name: "Delete space" }));
  expect(
    screen.getByText("Are you sure you want to delete this space?")
  ).toBeInTheDocument();

  await userEvent.click(
    within(screen.getByRole("complementary")).getByRole("button", {
      name: "Delete space",
    })
  );

  const expectedActions = [spaceActions.cleanup(), spaceActions.delete(1)];

  await waitFor(() => {
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) => actualAction.type === expectedAction.type
        )
      ).toStrictEqual(expectedAction);
    });
  });
});

it("displays an error if there are any subnets on the space.", async () => {
  const space = factory.space({
    id: 1,
    name: "space1",
    description: "space 1 description",
    subnet_ids: [1],
  });
  const state = factory.rootState({
    space: factory.spaceState({
      items: [space],
      loading: false,
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route element={<SpaceDetails />} path={urls.subnets.space.index(null)} />
    </Routes>,
    { route: urls.subnets.space.index({ id: 1 }), state }
  );
  await userEvent.click(screen.getByRole("button", { name: "Delete space" }));
  expect(screen.getByText(/Space cannot be deleted/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(screen.queryByText(/Space cannot be deleted/)).not.toBeInTheDocument();
});
