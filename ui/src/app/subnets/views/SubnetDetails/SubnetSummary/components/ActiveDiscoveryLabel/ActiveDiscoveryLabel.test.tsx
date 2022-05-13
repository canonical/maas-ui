import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ActiveDiscoveryLabel from "./ActiveDiscoveryLabel";

it("shows a tooltip when the subnet is managed", async () => {
  render(<ActiveDiscoveryLabel managed />);

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", {
      name: /When enabled, MAAS will scan this subnet/,
    })
  ).toBeInTheDocument();
});

it("does not show a tooltip when the subnet is not managed", () => {
  render(<ActiveDiscoveryLabel managed={false} />);

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
