import SubnetStaticIPs from "./SubnetStaticIPs";

import { renderWithBrowserRouter, screen } from "@/testing/utils";

it("renders", () => {
  renderWithBrowserRouter(<SubnetStaticIPs />);
  expect(
    screen.getByRole("heading", { name: "Static IPs" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Reserve static IP" })
  ).toBeInTheDocument();
});
