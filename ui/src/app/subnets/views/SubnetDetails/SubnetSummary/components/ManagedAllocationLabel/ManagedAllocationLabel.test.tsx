import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ManagedAllocationLabel from "./ManagedAllocationLabel";

it("shows a tooltip when the subnet is not managed", () => {
  render(<ManagedAllocationLabel managed={false} />);

  userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", {
      name: /MAAS allocates IP addresses from this subnet/,
    })
  ).toBeInTheDocument();
});

it("does not show a tooltip when the subnet is managed", () => {
  render(<ManagedAllocationLabel managed />);

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
