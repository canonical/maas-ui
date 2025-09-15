import ActiveDiscoveryLabel from "./ActiveDiscoveryLabel";

import { userEvent, render, screen } from "@/testing/utils";

it("displays a tooltip", async () => {
  render(<ActiveDiscoveryLabel />);

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", {
      name: /When enabled, MAAS will scan this subnet/,
    })
  ).toBeInTheDocument();
});
