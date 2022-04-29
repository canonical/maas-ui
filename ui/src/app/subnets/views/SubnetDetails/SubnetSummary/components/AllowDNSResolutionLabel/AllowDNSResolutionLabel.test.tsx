import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AllowDNSResolutionLabel from "./AllowDNSResolutionLabel";

it("shows a tooltip when DNS is allowed", () => {
  render(<AllowDNSResolutionLabel allowDNS />);

  userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", { name: /MAAS will allow clients/ })
  ).toBeInTheDocument();
});

it("shows a tooltip when DNS is not allowed", () => {
  render(<AllowDNSResolutionLabel allowDNS={false} />);

  userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", { name: /MAAS will not allow clients/ })
  ).toBeInTheDocument();
});
