import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProxyAccessLabel from "./ProxyAccessLabel";

it("shows a tooltip when proxy access is allowed", () => {
  render(<ProxyAccessLabel allowProxy />);

  userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", { name: /MAAS will allow clients/ })
  ).toBeInTheDocument();
});

it("shows a tooltip when proxy access is not allowed", () => {
  render(<ProxyAccessLabel allowProxy={false} />);

  userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", { name: /MAAS will not allow clients/ })
  ).toBeInTheDocument();
});
