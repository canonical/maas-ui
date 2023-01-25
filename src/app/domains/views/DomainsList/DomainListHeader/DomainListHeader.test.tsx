import { Labels as DomainListHeaderFormLabels } from "../DomainListHeaderForm/DomainListHeaderForm";

import DomainListHeader, {
  Labels as DomainListHeaderLabels,
} from "./DomainListHeader";

import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

describe("DomainListHeader", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [domainFactory(), domainFactory()],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loader if domains have not loaded", () => {
    const state = { ...initialState };
    state.domain.loaded = false;

    renderWithBrowserRouter(<DomainListHeader />, {
      route: "/domains",
      state,
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a domain count if domains have loaded", () => {
    const state = { ...initialState };
    state.domain.loaded = true;
    renderWithBrowserRouter(<DomainListHeader />, {
      route: "/domains",
      state,
    });

    expect(screen.getByText("2 domains available")).toBeInTheDocument();
  });

  it("displays the form when Add domains is clicked", async () => {
    const state = { ...initialState };
    renderWithBrowserRouter(<DomainListHeader />, {
      route: "/domains",
      state,
    });

    expect(
      screen.queryByRole("form", { name: DomainListHeaderFormLabels.FormLabel })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: DomainListHeaderLabels.AddDomains })
    );

    expect(
      screen.getByRole("form", { name: DomainListHeaderFormLabels.FormLabel })
    ).toBeInTheDocument();
  });
});
