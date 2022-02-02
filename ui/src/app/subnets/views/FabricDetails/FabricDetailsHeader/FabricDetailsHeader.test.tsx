import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router, Route } from "react-router";
import configureStore from "redux-mock-store";

import FabricDetailsHeader from "./FabricDetailsHeader";

import { actions as fabricActions } from "app/store/fabric";
import subnetsURLs from "app/subnets/urls";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const renderTestCase = (
  fabric = fabricFactory({
    id: 1,
    name: "fabric1",
    description: "fabric 1 description",
  })
) => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: subnetsURLs.fabric.index({ id: fabric.id }) }],
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [fabric],
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
            path={subnetsURLs.fabric.index({ id: fabric.id })}
            component={() => <FabricDetailsHeader fabric={fabric} />}
          />
        </Router>
      </Provider>
    ),
  };
};

it("shows the fabric name as the section title", () => {
  renderTestCase(fabricFactory({ id: 1, name: "fabric-1" }));

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "fabric-1"
  );
});

it("displays a delete confirmation before delete", () => {
  renderTestCase(
    fabricFactory({
      id: 1,
      name: "fabric-1",
      description: "fabric 1 description",
    })
  );
  userEvent.click(screen.getByRole("button", { name: "Delete fabric" }));
  expect(
    screen.getByText("Are you sure you want to delete fabric-1 fabric?")
  ).toBeInTheDocument();
});

it("deletes the fabric when confirmed", () => {
  const { store } = renderTestCase(fabricFactory({ id: 1, name: "fabric-1" }));
  userEvent.click(screen.getByRole("button", { name: "Delete fabric" }));
  userEvent.click(screen.getByRole("button", { name: "Yes, delete fabric" }));
  const expectedActions = [fabricActions.delete(1)];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});
