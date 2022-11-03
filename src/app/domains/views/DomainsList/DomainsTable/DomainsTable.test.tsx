import { screen, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DomainsTable, { Labels as DomainsTableLabels } from "./DomainsTable";

import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("DomainsTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            id: 1,
            name: "b",
            is_default: true,
          }),
          domainFactory({
            id: 2,
            name: "c",
            is_default: false,
          }),
          domainFactory({
            id: 3,
            name: "a",
            is_default: false,
          }),
        ],
      }),
    });
  });

  it("can update the sort order", async () => {
    renderWithBrowserRouter(<DomainsTable />, {
      route: "/domains",
      state,
    });

    const sortButton = screen.getByRole("columnheader", { name: "Domain" });

    // Sorted ascending by name by default
    let rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("a")).toBeInTheDocument();
    expect(within(rows[2]).getByText("b (default)")).toBeInTheDocument();
    expect(within(rows[3]).getByText("c")).toBeInTheDocument();

    // Change to sort descending by name
    await userEvent.click(sortButton);
    rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("c")).toBeInTheDocument();
    expect(within(rows[2]).getByText("b (default)")).toBeInTheDocument();
    expect(within(rows[3]).getByText("a")).toBeInTheDocument();

    // Change to no sort
    await userEvent.click(sortButton);
    rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("b (default)")).toBeInTheDocument();
    expect(within(rows[2]).getByText("c")).toBeInTheDocument();
    expect(within(rows[3]).getByText("a")).toBeInTheDocument();
  });

  it("has a (defaut) next to the default domain's title", () => {
    renderWithBrowserRouter(<DomainsTable />, {
      route: "/domains",
      state,
    });

    expect(
      within(screen.getByRole("row", { name: "b" })).getByText("b (default)")
    ).toBeInTheDocument();
  });

  it("calls the setDefault action if set default is clicked", async () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <CompatRouter>
            <DomainsTable />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    let row = screen.getByRole("row", { name: "a" });
    // Only one button is rendered within the contextual menu (the button to open it),
    // which is why I'm doing an unlabelled search - adding an aria-label to the button
    // would require a change to the component in canonical/react-components
    await userEvent.click(
      within(within(row).getByLabelText(DomainsTableLabels.Actions)).getByRole(
        "button"
      )
    );

    await userEvent.click(
      screen.getByRole("button", { name: DomainsTableLabels.SetDefault })
    );

    row = screen.getByRole("row", { name: "a" });
    await userEvent.click(
      within(
        within(row).getByRole("gridcell", {
          name: DomainsTableLabels.TableAction,
        })
      ).getByRole("button", { name: DomainsTableLabels.ConfirmSetDefault })
    );

    expect(
      store.getActions().find((action) => action.type === "domain/setDefault")
    ).toStrictEqual({
      type: "domain/setDefault",
      meta: {
        method: "set_default",
        model: "domain",
      },
      payload: {
        params: {
          domain: 3,
        },
      },
    });
  });
});
