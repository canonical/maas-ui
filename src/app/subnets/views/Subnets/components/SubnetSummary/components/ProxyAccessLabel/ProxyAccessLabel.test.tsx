import ProxyAccessLabel from "./ProxyAccessLabel";

import { userEvent, render, screen } from "@/testing/utils";

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
