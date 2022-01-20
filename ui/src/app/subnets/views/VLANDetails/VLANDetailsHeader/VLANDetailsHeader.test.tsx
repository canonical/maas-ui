import { render, screen } from "@testing-library/react";

import VLANDetailsHeader from "./VLANDetailsHeader";

import {
  vlan as vlanFactory,
  vlanDetails as vlanDetailsFactory,
} from "testing/factories";

it("shows the vlan name as the section title", () => {
  const vlan = vlanFactory({ id: 1, name: "vlan-1" });
  render(<VLANDetailsHeader vlan={vlan} />);

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "vlan-1"
  );
});

it("shows a spinner subtitle if the vlan is loading details", () => {
  const vlan = vlanFactory({ id: 1, name: "vlan-1" });
  render(<VLANDetailsHeader vlan={vlan} />);

  expect(
    screen.queryByTestId("section-header-subtitle-spinner")
  ).toBeInTheDocument();
});

it("does not show a spinner subtitle if the vlan is detailed", () => {
  const vlan = vlanDetailsFactory({ id: 1, name: "vlan-1" });
  render(<VLANDetailsHeader vlan={vlan} />);

  expect(screen.queryByTestId("section-header-subtitle-spinner")).toBeNull();
});
