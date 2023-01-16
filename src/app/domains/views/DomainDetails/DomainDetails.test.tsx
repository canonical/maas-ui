import DomainDetails from "./DomainDetails";

import {
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

describe("DomainDetails", () => {
  it("renders 'Not Found' header if domains loaded and domain not found", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [],
        loading: false,
      }),
    });
    renderWithBrowserRouter(<DomainDetails />, {
      route: "/domain/1",
      state,
    });

    expect(screen.getByText("Domain not found")).toBeInTheDocument();
  });
});
