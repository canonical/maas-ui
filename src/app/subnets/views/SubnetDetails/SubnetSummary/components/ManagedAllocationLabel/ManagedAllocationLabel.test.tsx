import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ManagedAllocationLabel from "./ManagedAllocationLabel";

it("shows a tooltip", async () => {
  render(<ManagedAllocationLabel />);

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", {
      name: /MAAS allocates IP addresses from this subnet/,
    })
  ).toBeInTheDocument();
});
