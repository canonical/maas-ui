import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProxyAccessLabel from "./ProxyAccessLabel";

it("shows a tooltip when proxy access is allowed", async () => {
  render(<ProxyAccessLabel allowProxy />);

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", { name: /MAAS will allow clients/ })
  ).toBeInTheDocument();
});

it("shows a tooltip when proxy access is not allowed", async () => {
  render(<ProxyAccessLabel allowProxy={false} />);

  await userEvent.click(screen.getByRole("button"));

  expect(
    screen.getByRole("tooltip", { name: /MAAS will not allow clients/ })
  ).toBeInTheDocument();
});
