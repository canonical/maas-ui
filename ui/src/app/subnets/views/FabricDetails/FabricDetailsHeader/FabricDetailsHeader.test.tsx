import { render, screen } from "@testing-library/react";

import FabricDetailsHeader from "./FabricDetailsHeader";

import { fabric as fabricFactory } from "testing/factories";

it("shows the fabric name as the section title", () => {
  const fabric = fabricFactory({ id: 1, name: "fabric-1" });
  render(<FabricDetailsHeader fabric={fabric} />);

  expect(screen.getByTestId("section-header-title")).toHaveTextContent(
    "fabric-1"
  );
});
