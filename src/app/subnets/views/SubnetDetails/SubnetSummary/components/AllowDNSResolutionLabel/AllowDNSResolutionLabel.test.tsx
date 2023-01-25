import AllowDNSResolutionLabel from "./AllowDNSResolutionLabel";

import { userEvent, render, screen } from "testing/utils";

it("shows a tooltip when DNS is allowed", async () => {
  render(<AllowDNSResolutionLabel allowDNS />);

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", { name: /MAAS will allow clients/ })
  ).toBeInTheDocument();
});

it("shows a tooltip when DNS is not allowed", async () => {
  render(<AllowDNSResolutionLabel allowDNS={false} />);

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", { name: /MAAS will not allow clients/ })
  ).toBeInTheDocument();
});
