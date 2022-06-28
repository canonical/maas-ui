import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import DHCPSnippets from "./DHCPSnippets";

import type { Props as DHCPTableProps } from "app/base/components/DHCPTable/DHCPTable";
import { actions as subnetActions } from "app/store/subnet";
import subnetsURLs from "app/subnets/urls";
import {
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();
const mockDHCPTable = jest.fn();
jest.mock("app/base/components/DHCPTable", () => (props: DHCPTableProps) => {
  mockDHCPTable(props);
  return null;
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("dispatches an action to fetch the subnets on mount", () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <DHCPSnippets modelName="subnet" subnetIds={[1, 2]} />
      </MemoryRouter>
    </Provider>
  );

  const expectedActions = [subnetActions.fetch()];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("selects the correct subnets to display in the table", () => {
  const subnets = [subnetFactory(), subnetFactory(), subnetFactory()];
  const state = rootStateFactory({
    subnet: subnetStateFactory({
      items: subnets,
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <Route
          component={() => (
            <DHCPSnippets
              modelName="subnet"
              subnetIds={[subnets[0].id, subnets[2].id]}
            />
          )}
          exact
          path={subnetsURLs.subnet.index(null)}
        />
      </MemoryRouter>
    </Provider>
  );
  expect(mockDHCPTable).toHaveBeenCalledWith(
    expect.objectContaining({
      subnets: [subnets[0], subnets[2]],
      modelName: "subnet",
    })
  );
});
