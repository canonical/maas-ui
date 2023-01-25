import { subnetActionLabels } from "../constants";

import SubnetDetailsHeader from "./SubnetDetailsHeader";

import {
  subnet as subnetFactory,
  subnetDetails as subnetDetailsFactory,
} from "testing/factories";
import { userEvent, render, screen } from "testing/utils";

it("shows the subnet name as the section title", () => {
  const subnet = subnetFactory({ id: 1, name: "subnet-1" });
  render(<SubnetDetailsHeader subnet={subnet} />);

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "subnet-1"
  );
});

it("shows a spinner subtitle if the subnet is loading details", () => {
  const subnet = subnetFactory({ id: 1, name: "subnet-1" });
  render(<SubnetDetailsHeader subnet={subnet} />);

  expect(
    screen.getByTestId("section-header-subtitle-spinner")
  ).toBeInTheDocument();
});

it("does not show a spinner subtitle if the subnet is detailed", () => {
  const subnet = subnetDetailsFactory({ id: 1, name: "subnet-1" });
  render(<SubnetDetailsHeader subnet={subnet} />);

  expect(screen.queryByTestId("section-header-subtitle-spinner")).toBeNull();
});

it("displays available actions", async () => {
  const subnet = subnetDetailsFactory({ id: 1, name: "subnet-1" });
  render(<SubnetDetailsHeader subnet={subnet} />);

  Object.values(subnetActionLabels).forEach((name) => {
    expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
  });

  await userEvent.click(screen.getByRole("button", { name: "Take action" }));

  Object.values(subnetActionLabels).forEach((name) => {
    expect(screen.getByRole("button", { name })).toBeInTheDocument();
  });
});
