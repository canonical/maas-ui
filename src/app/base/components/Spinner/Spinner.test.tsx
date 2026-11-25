import Spinner from "./Spinner";

import { renderWithProviders, screen } from "@/testing/utils";

describe("Spinner", () => {
  it("shows the label beside the activity indicator", () => {
    renderWithProviders(<Spinner text="Loading..." />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Loading...");
    const icon = alert.querySelector("svg");
    expect(icon).toHaveClass("ds", "spinner");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon?.querySelector("use")).toHaveAttribute(
      "href",
      "/icons/spinner.svg#spinner"
    );
  });

  it("keeps an accessible loading name when no label is visible", () => {
    renderWithProviders(<Spinner />);

    expect(screen.getByRole("alert")).toHaveTextContent("Loading");
    expect(screen.getByText("Loading")).toHaveClass("u-visually-hidden");
  });

  it("uses an explicit accessible name without adding the fallback label", () => {
    renderWithProviders(<Spinner aria-label="Loading controllers" />);

    expect(
      screen.getByRole("alert", { name: "Loading controllers" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("keeps the visible label when an accessible name is also set", () => {
    renderWithProviders(
      <Spinner aria-label="Loading machine" text="Loading..." />
    );

    expect(
      screen.getByRole("alert", { name: "Loading machine" })
    ).toHaveTextContent("Loading...");
  });

  it("puts pass-through attributes on the outer element", () => {
    renderWithProviders(
      <Spinner className="u-text--muted" id="loading-subnet" />
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("p-spinner", "u-text--muted");
    expect(alert).toHaveAttribute("id", "loading-subnet");
    expect(alert).toHaveAttribute("aria-live", "polite");
  });
});
