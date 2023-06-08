import configureStore from "redux-mock-store";

import DomainsList from "./DomainsList";
import { Labels as DomainsTableLabels } from "./DomainsTable/DomainsTable";

import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DomainsList", () => {
  it("correctly fetches the necessary data", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    renderWithBrowserRouter(<DomainsList />, { route: "/domains", store });
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
