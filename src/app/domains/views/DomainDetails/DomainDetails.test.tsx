import DomainDetails from "./DomainDetails";

import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("DomainDetails", () => {
  it("renders 'Not Found' header if domains loaded and domain not found", () => {
    const state = factory.rootState({
      domain: factory.domainState({
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
