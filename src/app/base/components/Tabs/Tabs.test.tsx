import { useState } from "react";

import Tabs from "./Tabs";

import { renderWithProviders, screen, userEvent } from "@/testing/utils";

describe("Tabs", () => {
  it("renders router destinations and marks the active one as the current page", () => {
    renderWithProviders(
      <Tabs
        aria-label="Section navigation"
        links={[
          { active: true, label: "Scripts", to: "/machine/abc/scripts" },
          { active: false, label: "Logs", to: "/machine/abc/logs" },
        ]}
      />,
      { initialEntries: ["/machine/abc/scripts/commissioning/1"] }
    );

    expect(
      screen.getByRole("navigation", { name: "Section navigation" })
    ).toBeInTheDocument();
    const scripts = screen.getByRole("link", { name: "Scripts" });
    expect(scripts).toHaveAttribute("href", "/machine/abc/scripts");
    expect(scripts).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Logs" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("switches in-page tabs through their click handler", async () => {
    const LogTabs = () => {
      const [active, setActive] = useState("combined");
      return (
        <Tabs
          aria-label="Log output"
          links={["combined", "stderr"].map((label) => ({
            active: active === label,
            label,
            onClick: () => {
              setActive(label);
            },
          }))}
        />
      );
    };

    renderWithProviders(<LogTabs />);

    expect(screen.getByRole("link", { name: "combined" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await userEvent.click(screen.getByRole("link", { name: "stderr" }));
    expect(screen.getByRole("link", { name: "stderr" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "combined" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("renders a label that contains an icon", () => {
    renderWithProviders(
      <Tabs
        links={[
          {
            active: true,
            label: (
              <>
                <span>error</span>
                Configuration
              </>
            ),
            to: "/machine/abc/configuration",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("link", { name: /error configuration/i })
    ).toBeInTheDocument();
  });
});
