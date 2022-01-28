import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router, Route } from "react-router";
import configureStore from "redux-mock-store";

import SpaceDetailsHeader from "./SpaceDetailsHeader";

import { actions as spaceActions } from "app/store/space";
import subnetsURLs, { getNetworksLocation } from "app/subnets/urls";
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
    initialEntries: [{ pathname: subnetsURLs.space.index({ id: space.id }) }],
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
          <Route
            exact
            path={subnetsURLs.space.index({ id: space.id })}
            component={() => <SpaceDetailsHeader space={space} />}
          />
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

it("displays a delete confirmation before delete", () => {
  const { store } = renderTestCase(
    spaceFactory({
      id: 1,
      name: "space1",
      description: "space 1 description",
    })
  );
  userEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(
    screen.getByText("Are you sure you want to delete space1 space?")
  ).toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "Yes, delete space" }));
  expect(
    screen.queryByText("Are you sure you want to delete space1 space?")
  ).not.toBeInTheDocument();

  const expectedActions = [spaceActions.delete(1)];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("redirects to main networks view on after delete", () => {
  const space = spaceFactory({
    id: 1,
    name: "space1",
    description: "space 1 description",
  });
  const { history } = renderTestCase(space);
  userEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(
    screen.getByText("Are you sure you want to delete space1 space?")
  ).toBeInTheDocument();

  expect(history.location).toMatchObject({
    pathname: subnetsURLs.space.index({ id: space.id }),
  });
  userEvent.click(screen.getByRole("button", { name: "Yes, delete space" }));
  expect(history.location).toMatchObject(getNetworksLocation({ by: "space" }));
});

it("displays an error if there are any subnets on the space.", () => {
  renderTestCase(
    spaceFactory({
      id: 1,
      name: "space1",
      description: "space 1 description",
      subnet_ids: [1],
    })
  );
  userEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(screen.getByText(/Space cannot be deleted/)).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Close notification" }));

  expect(screen.queryByText(/Space cannot be deleted/)).not.toBeInTheDocument();
});
