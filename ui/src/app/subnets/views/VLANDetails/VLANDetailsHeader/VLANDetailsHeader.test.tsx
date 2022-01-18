import { render, screen } from "@testing-library/react";

import VLANDetailsHeader from "./VLANDetailsHeader";

import { vlan as vlanFactory } from "testing/factories";

it("shows the vlan name as the section title", () => {
  const vlan = vlanFactory({ id: 1, name: "vlan-1" });
  render(<VLANDetailsHeader vlan={vlan} />);

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "vlan-1"
  );
});
