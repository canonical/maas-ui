import { screen } from "@testing-library/react";

import SettingsBackLink from "./SettingsBackLink";

import { renderWithProviders } from "@/testing/utils";

describe("SettingsBackLink", () => {
  it("does not render is no from is provided", () => {
    renderWithProviders(<SettingsBackLink />);

    const link = screen.queryByText(/Settings/i);
    expect(link).not.toBeInTheDocument();
  });

  it("links back to previous state when provided", () => {
    renderWithProviders(<SettingsBackLink />, {
      initialEntries: ["/kvm/lxd/cluster/20/hosts", "/settings"],
    });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/kvm/lxd/cluster/20/hosts");
  });
});
