import configureStore from "redux-mock-store";

import DomainsTable, { Labels as DomainsTableLabels } from "./DomainsTable";

import SetDefaultForm from "@/app/domains/components/SetDefaultForm";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  within,
  mockSidePanel,
  renderWithProviders,
} from "@/testing/utils";

const mockStore = configureStore();
const { mockOpen } = await mockSidePanel();

describe("DomainsTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      domain: factory.domainState({
        items: [
          factory.domain({
            id: 1,
            name: "b",
            is_default: true,
          }),
          factory.domain({
            id: 2,
            name: "c",
            is_default: false,
          }),
          factory.domain({
            id: 3,
            name: "a",
            is_default: false,
          }),
        ],
      }),
    });
  });

  it("can update the sort order", async () => {
    renderWithProviders(<DomainsTable />, {
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
    renderWithProviders(<DomainsTable />, {
      state,
    });

    expect(
      within(screen.getByRole("row", { name: "b" })).getByText("b (default)")
    ).toBeInTheDocument();
  });

  it("triggers the setDefault sidepanel if set default is clicked", async () => {
    const store = mockStore(state);

    renderWithProviders(<DomainsTable />, { store });

    const row = screen.getByRole("row", { name: "a" });
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

    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        component: SetDefaultForm,
        title: "Set default",
        props: {
          id: state.domain.items[2].id,
        },
      })
    );
  });

  it("displays an empty table message", () => {
    state.domain.items = [];
    renderWithProviders(<DomainsTable />, { state });

    expect(screen.getByText(DomainsTableLabels.EmptyList)).toBeInTheDocument();
  });
});
