import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DomainsList from "./DomainsList";
import { Labels as DomainsTableLabels } from "./DomainsTable/DomainsTable";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("DomainsList", () => {
  it("correctly fetches the necessary data", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <CompatRouter>
            <DomainsList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["domain/fetch"];
    const actualActions = store.getActions();
    expect(
      expectedActions.every((expectedAction) =>
        actualActions.some((action) => action.type === expectedAction)
      )
    ).toBe(true);
  });

  it("shows a domains table if there are any domains", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ name: "test" })],
      }),
    });
    renderWithBrowserRouter(<DomainsList />, {
      route: "/",
      state,
    });

    expect(
      screen.getByRole("grid", { name: DomainsTableLabels.TableLable })
    ).toBeInTheDocument();
  });
});
