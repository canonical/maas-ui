import SwitchDetailsHeader from "./SwitchDetailsHeader";

import type { SwitchResponse } from "@/app/apiclient";
import { renderWithProviders, screen } from "@/testing/utils";

const switchItem: SwitchResponse = {
  id: 1,
  name: "switch-1",
};

describe("SwitchDetailsHeader", () => {
  it("displays the switch name", () => {
    renderWithProviders(<SwitchDetailsHeader switchItem={switchItem} />, {
      initialEntries: ["/switches/1/summary"],
      pattern: "/switches/:id/*",
    });

    expect(
      screen.getByRole("heading", { name: "switch-1" })
    ).toBeInTheDocument();
  });

  it("renders a summary tab link", () => {
    renderWithProviders(<SwitchDetailsHeader switchItem={switchItem} />, {
      initialEntries: ["/switches/1/summary"],
      pattern: "/switches/:id/*",
    });

    expect(screen.getByRole("link", { name: "Summary" })).toHaveAttribute(
      "href",
      "/switches/1/summary"
    );
  });
});
