import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ActiveDiscoveryLabel from "./ActiveDiscoveryLabel";

it("displays a tooltip", async () => {
  render(<ActiveDiscoveryLabel />);

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", {
      name: /When enabled, MAAS will scan this subnet/,
    })
  ).toBeInTheDocument();
});
