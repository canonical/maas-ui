import configureStore from "redux-mock-store";

import DomainsList from "./DomainsList";

import { Labels as DomainsTableLabels } from "@/app/domains/components/DomainsTable/DomainsTable";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithProviders } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("DomainsList", () => {
  it("correctly fetches the necessary data", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    renderWithProviders(<DomainsList />, { store });
    const expectedActions = ["domain/fetch"];
    const actualActions = store.getActions();
    expect(
      expectedActions.every((expectedAction) =>
        actualActions.some((action) => action.type === expectedAction)
      )
    ).toBe(true);
  });

  it("shows a domains table if there are any domains", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domain({ name: "test" })],
      }),
    });
    renderWithProviders(<DomainsList />, {
      state,
    });

    expect(
      screen.getByRole("grid", { name: DomainsTableLabels.TableLable })
    ).toBeInTheDocument();
  });
});
