import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router, Route } from "react-router";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SpaceDetailsHeader from "./SpaceDetailsHeader";

import urls from "app/base/urls";
import { actions as spaceActions } from "app/store/space";
import {
  space as spaceFactory,
  spaceState as spaceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const renderTestCase = (
  space = spaceFactory({
    id: 1,
    name: "space1",
    description: "space 1 description",
  })
) => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: urls.subnets.space.index({ id: space.id }) }],
  });
  const state = rootStateFactory({
    space: spaceStateFactory({
      items: [space],
      loading: false,
    }),
  });
  const store = configureStore()(state);
  return {
    history,
    store,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <CompatRouter>
            <Route
              component={() => <SpaceDetailsHeader space={space} />}
              exact
              path={urls.subnets.space.index({ id: space.id })}
            />
          </CompatRouter>
        </Router>
      </Provider>
    ),
  };
};

it("shows the space name as the section title", () => {
  renderTestCase(spaceFactory({ id: 1, name: "space-1" }));

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "space-1"
  );
});

it("displays a delete confirmation before delete", async () => {
  const { store } = renderTestCase(
    spaceFactory({
      id: 1,
      name: "space1",
      description: "space 1 description",
    })
  );
  await userEvent.click(screen.getByRole("button", { name: "Delete space" }));
  expect(
    screen.getByText("Are you sure you want to delete this space?")
  ).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Delete space" }));

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
  renderTestCase(
    spaceFactory({
      id: 1,
      name: "space1",
      description: "space 1 description",
      subnet_ids: [1],
    })
  );
  await userEvent.click(screen.getByRole("button", { name: "Delete space" }));
  expect(screen.getByText(/Space cannot be deleted/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(screen.queryByText(/Space cannot be deleted/)).not.toBeInTheDocument();
});
