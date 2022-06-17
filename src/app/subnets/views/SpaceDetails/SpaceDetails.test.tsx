import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SpaceDetails from "./SpaceDetails";

import { actions as spaceActions } from "app/store/space";
import subnetsURLs from "app/subnets/urls";
import {
  spaceState as spaceStateFactory,
  space as spaceFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("dispatches actions to get and set space as active on mount", () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.space.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <SpaceDetails />}
            exact
            path={subnetsURLs.space.index(null, true)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
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
  const state = rootStateFactory();
  const store = mockStore(state);
  const { unmount } = render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.space.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <SpaceDetails />}
            exact
            path={subnetsURLs.space.index(null, true)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
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
  const state = rootStateFactory({
    space: spaceStateFactory({
      items: [],
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.space.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <SpaceDetails />}
            exact
            path={subnetsURLs.space.index(null, true)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Space not found")).toBeInTheDocument();
});

it("shows a spinner if the space has not loaded yet", () => {
  const state = rootStateFactory({
    space: spaceStateFactory({
      items: [],
      loading: true,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.space.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <SpaceDetails />}
            exact
            path={subnetsURLs.space.index(null, true)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByTestId("section-header-title-spinner")
  ).toBeInTheDocument();
});

it("displays space details", async () => {
  const space = spaceFactory({
    id: 1,
    name: "space1",
    description: "space 1 description",
  });
  const state = rootStateFactory({
    space: spaceStateFactory({
      items: [space],
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.space.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <SpaceDetails />}
            exact
            path={subnetsURLs.space.index(null, true)}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const spaceSummary = await screen.findByRole("region", {
    name: "Space summary",
  });
  expect(within(spaceSummary).getByText(space.name)).toBeInTheDocument();
  expect(within(spaceSummary).getByText(space.description)).toBeInTheDocument();
});
