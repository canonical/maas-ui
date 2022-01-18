import { render, screen } from "@testing-library/react";

import SubnetDetailsHeader from "./SubnetDetailsHeader";

import { subnet as subnetFactory } from "testing/factories";

it("shows the subnet name as the section title", () => {
  const subnet = subnetFactory({ id: 1, name: "subnet-1" });
  render(<SubnetDetailsHeader subnet={subnet} />);

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "subnet-1"
  );
});
